import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { GenresService } from '../genres/genres.service';
import { addGenresDto } from './dtos/add-genres.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('games')
export class GamesController {
  constructor(
    private gamesService: GamesService,
    private genresService: GenresService
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.gamesService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.gamesService.findOne(id);
  }

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    return await this.gamesService.create(createGameDto);
  }

  @Post('addgenres')
  @UseGuards(AuthGuard)
  async addGenres(@Body() addGenresDto: addGenresDto) {
    const genres = await this.genresService.findSome(addGenresDto.genreIds);
    return this.gamesService.addGenres(addGenresDto.gameId, genres);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateGameDto: Partial<UpdateGameDto>) {
    return await this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.gamesService.remove(id);
  }
}
