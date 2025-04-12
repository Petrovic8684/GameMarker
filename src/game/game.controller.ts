import { Controller, Get, Param, Query } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('page_size') pageSize: number = 10,
    @Query('search') search: string = '',
  ) {
    return this.gameService.findAll(page, pageSize, search);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gameService.findOne(+id);
  }
}
