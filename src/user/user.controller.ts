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

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser('username') email: string) {
    return this.userService.getMe(email);
  }

  @Patch('me')
  editUser(
    @GetUser('username') email: string,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(email, dto);
  }
}
