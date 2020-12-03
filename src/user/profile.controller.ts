import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { UserEntity } from '../entities/user.entity';
import { User } from '../auth/user.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get('/:userename')
  async findProfile(@Param('username') username: string) {
    const profile = await this.userService.findByUsername(username);
    if (!profile) {
      throw new NotFoundException();
    }
    return { profile };
  }

  @Post('/:username/follow')
  @UseGuards(AuthGuard())
  async followUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ) {
    const profile = await this.userService.followUser(user, username);
    return { profile };
  }

  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ) {
    const profile = this.userService.unfollowUser(user, username);
    return { profile };
  }
}
