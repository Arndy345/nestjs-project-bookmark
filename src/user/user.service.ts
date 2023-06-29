import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(email) {
    const User =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    delete User.hash;
    return User;
  }
}
