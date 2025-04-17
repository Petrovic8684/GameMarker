import { Controller, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserBioDto } from './dto/update-user-bio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/role.decorator';
import { Role as Roles } from '../common/enums/role.enum';
import { UpdateUserBanStatusDto } from './dto/update-user-ban-status.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Role([Roles.regular, Roles.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/bio')
  updateBio(@Param('id') id: string, @Body() updateUserDto: UpdateUserBioDto) {
    return this.userService.updateBio(+id, updateUserDto);
  }

  @Role([Roles.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/banned')
  updateBanStatus(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserBanStatusDto,
  ) {
    return this.userService.updateBanStatus(+id, updateUserDto);
  }
}
