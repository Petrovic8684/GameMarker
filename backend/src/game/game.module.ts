import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [HttpModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
