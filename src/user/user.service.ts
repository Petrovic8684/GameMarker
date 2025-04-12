import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUserService } from '../auth/auth-user.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authUserService: AuthUserService,
  ) {}

  async update(id: number, updateUserDto: UpdateUserDto) {
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
}
