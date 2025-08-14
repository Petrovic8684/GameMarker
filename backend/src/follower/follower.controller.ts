import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/role.decorator';
import { Role as Roles } from '../common/enums/role.enum';

@Controller('followers')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Get('/user/:id')
  findFollowerListOfUser(@Param('id') id: string) {
    return this.followerService.findFollowerListOfUser(+id);
  }

  @Post('/user/:id')
  @Role([Roles.regular, Roles.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  followUser(@Param('id') id: string) {
    return this.followerService.followUser(+id);
  }

  @Delete('/user/:id')
  @Role([Roles.regular, Roles.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  unfollowUser(@Param('id') id: string) {
    return this.followerService.unfollowUser(+id);
  }

  @Patch(':id')
  @Role([Roles.regular, Roles.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  dismissFollow(@Param('id') id: string) {
    return this.followerService.dismissFollow(+id);
  }
}
