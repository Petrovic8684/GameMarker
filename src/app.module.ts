import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { ReviewModule } from './review/review.module';
import { FollowerModule } from './follower/follower.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, GameModule, ReviewModule, FollowerModule, UserModule],
})
export class AppModule {}
