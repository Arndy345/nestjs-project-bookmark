import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators';
import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../auth';
import { User } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return this.userService.getMe(user);
  }

  @Patch('me')
  editUser(
    @GetUser('username') email: string,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(email, dto);
  }
}
