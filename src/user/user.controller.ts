import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from '../auth/user.decorator';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';
import { AuthService } from 'src/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  findCurrentUser(@User() { username }: UserEntity) {
    return this.authService.findCurrentUser(username);
  }

  @Put()
  @UseGuards(AuthGuard())
  update(
    @User() { username }: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: { user: UpdateUserDTO },
  ) {
    return this.authService.updateUser(username, data.user);
  }
}
