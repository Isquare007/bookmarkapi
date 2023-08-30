import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator/user.decorator';
import { User } from '@prisma/client';
import { jwtGuard } from '../auth/guard/jwt.guard';
import { EditDto } from './dto';
import { UserService } from './user.service';

@UseGuards(jwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditDto) {
    return this.userService.editUser(userId, dto)
  }
}
