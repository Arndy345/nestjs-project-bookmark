import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators';
import { UserService } from './user.service';

import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@GetUser('username') email: string) {

    return this.userService.getMe(email);
  }
}
