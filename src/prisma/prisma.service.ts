import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    //ensures the actions are carried out sequentially
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
