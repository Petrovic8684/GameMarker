import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUserService } from '../auth/auth-user.service';

@Injectable()
export class FollowerService {
  constructor(
    private prisma: PrismaService,
    private authUserService: AuthUserService,
  ) {}

  async followUser(id: number) {
    const userId = this.authUserService.user.id;

    const followedUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!followedUser)
      throw new BadRequestException(`User with ID ${id} not found`);

    if (userId === id)
      throw new BadRequestException('Unable to follow yourself');

    const existingFollow = await this.prisma.follower.findUnique({
      where: {
        followerId_followedId: {
          followerId: userId,
          followedId: id,
        },
      },
    });

    if (existingFollow)
      throw new BadRequestException('Already following this user');

    const followData = await this.prisma.follower.create({
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            image: true,
            gender: true,
            bio: true,
          },
        },
        followed: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            image: true,
            gender: true,
            bio: true,
          },
        },
      },
      data: {
        followerId: userId,
        followedId: id,
      },
    });

    const { followerId, followedId, ...rest } = followData;

    return { message: 'Successfully followed user', followData: rest };
  }

  async unfollowUser(id: number) {
    const userId = this.authUserService.user.id;

    const followedUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!followedUser)
      throw new BadRequestException(`User with ID ${id} not found`);

    const followData = await this.prisma.follower.findUnique({
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            image: true,
            gender: true,
            bio: true,
          },
        },
        followed: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            image: true,
            gender: true,
            bio: true,
          },
        },
      },
      where: {
        followerId_followedId: {
          followerId: userId,
          followedId: id,
        },
      },
    });

    if (!followData)
      throw new BadRequestException('Already not following this user');

    await this.prisma.follower.delete({
      where: {
        followerId_followedId: {
          followerId: userId,
          followedId: id,
        },
      },
    });

    const { followerId, followedId, ...rest } = followData;

    return { message: 'Successfully unfollowed user', followData: rest };
  }

  async findFollowerListOfUser(id: number) {
    const followers = await this.prisma.follower.findMany({
      where: {
        followedId: id,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            image: true,
            gender: true,
            bio: true,
          },
        },
      },
    });

    const followData = followers.map((follow) => {
      const { followerId, followedId, ...rest } = follow;
      return {
        ...rest,
        follower: follow.follower,
      };
    });

    return {
      message: `Successfully found follower list of user with ID ${id}`,
      followData,
    };
  }

  async dismissFollow(id: number) {
    const existingFollow = await this.prisma.follower.findUnique({
      where: { id },
    });

    if (!existingFollow)
      throw new NotFoundException(`Follow record with ID ${id} not found`);

    if (existingFollow.dismissed === true)
      throw new BadRequestException(`Follow with ID ${id} already dismissed`);

    const updatedFollow = await this.prisma.follower.update({
      where: { id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            image: true,
            gender: true,
            bio: true,
          },
        },
      },
      data: {
        dismissed: true,
      },
    });

    const { followerId, followedId, ...rest } = updatedFollow;

    return {
      message: 'Successfully dismissed follow',
      followData: {
        ...rest,
        follower: updatedFollow.follower,
      },
    };
  }
}
