import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { AdminGuard } from '../../guards/admin.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { GameDto } from './dtos/game.dto';
import { SearchGamesDto } from './dtos/search-games.dto';

@Controller('games')
@Serialize(GameDto)
export class GamesController {
  constructor(
    private gamesService: GamesService
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.gamesService.find(query);
  }

  @Get('search')
  async search(@Query() query: SearchGamesDto) {
    return await this.gamesService.search(query);
  }

  @Get('alphabet')
  async alphabet(@Query('q') word: string) {
    return await this.gamesService.alphabet(word);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.gamesService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createGameDto: CreateGameDto) {
    return await this.gamesService.create(createGameDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: number, @Body() updateGameDto: Partial<UpdateGameDto>) {
    return await this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number) {
    return await this.gamesService.remove(id);
  }
}
