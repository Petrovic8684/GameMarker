import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUserService } from '../auth/auth-user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService, AuthUserService],
})
export class UserModule {}
