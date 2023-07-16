import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(user) {
    const User =
      await this.prisma.user.findUnique({
        where: {
          email: user.username,
        },
      });
    delete User.hash;
    return User;
  }

  async editUser(email: string, dto) {
    const User = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        ...dto,
      },
    });
    delete User.hash;
    return User;
  }
}
