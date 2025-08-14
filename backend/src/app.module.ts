import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { ReviewModule } from './review/review.module';
import { FollowerModule } from './follower/follower.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, GameModule, ReviewModule, FollowerModule, UserModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
