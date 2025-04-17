import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserBioDto } from './dto/update-user-bio.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUserService } from '../auth/auth-user.service';
import { UpdateUserBanStatusDto } from './dto/update-user-ban-status.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authUserService: AuthUserService,
  ) {}

  async updateBio(id: number, updateUserDto: UpdateUserBioDto) {
    let { bio } = updateUserDto;
    if (bio === '') bio = null;

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        bio: true,
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (id !== this.authUserService.user.id)
      throw new ForbiddenException(
        'Only the owner of this account can update it',
      );

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { bio: bio === undefined ? user.bio : bio },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        image: true,
        gender: true,
        bio: true,
      },
    });

    return {
      message: 'Successfully updated user bio',
      user: updatedUser,
    };
  }

  async updateBanStatus(id: number, updateUserDto: UpdateUserBanStatusDto) {
    let { isBanned } = updateUserDto;

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        isBanned: true,
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (user.role === 'admin')
      throw new ForbiddenException(`User with ID ${id} is an admin`);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isBanned: isBanned },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        image: true,
        gender: true,
        bio: true,
        isBanned: true,
      },
    });

    return {
      message: 'Successfully updated user ban status',
      user: updatedUser,
    };
  }
}
