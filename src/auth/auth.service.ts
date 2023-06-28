import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { error } from 'console';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signin(dto) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    if (!user)
      throw new ForbiddenException(
        'User not found',
      );
    try {
      if (
        await argon.verify(
          user.hash,
          dto.password,
        )
      ) {
        delete user.hash;
        const payload = {
          sub: user.id,
          username: user.email,
        };
        return {
          access_token:
            await this.jwtService.signAsync(
              payload,
            ),
        };
      } else {
        return `Incorrect Password`;
      }
    } catch (err) {
      throw new error('Server Error');
    }
  }

  async signup(dto: AuthDto) {
    try {
      //generate hashed password
      const hash = await argon.hash(dto.password);

      //save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      delete user.hash;
      //return saved user
      return user;
    } catch (e) {
      if (
        e instanceof
        Prisma.PrismaClientKnownRequestError
      ) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'Credientials taken',
          );
        }
      }
      throw e;
    }
  }
}
