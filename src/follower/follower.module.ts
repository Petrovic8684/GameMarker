import { Module } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { FollowerController } from './follower.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUserService } from '../auth/auth-user.service';

@Module({
  controllers: [FollowerController],
  providers: [FollowerService, PrismaService, JwtService, AuthUserService],
})
export class FollowerModule {}
