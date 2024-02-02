import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { GamelistsService } from './gamelists.service';
import { CreateGamelistDto } from './dtos/create-gamelist.dto';
import { UpdateGamelistDto } from './dtos/Update-gamelist.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UsersService } from '../users/users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { GamelistDto } from './dtos/gamelist.dto';
import { GamesService } from '../games/games.service';
import { Game } from '../games/entities/game.entity';
import { AddGamesDto } from './dtos/add-games.dto';

@Controller('gamelists')
@Serialize(GamelistDto)
export class GamelistsController {
  constructor(
    private gamelistsService: GamelistsService,
    private usersService: UsersService,
    private gamesService: GamesService,
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.gamelistsService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.gamelistsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createGamelistDto: CreateGamelistDto, @Session() session: Record<string, any>) {
    const user = await this.usersService.findOne(session.userId);
    return await this.gamelistsService.create(createGamelistDto, user);
  }

  @Post('addGames')
  @UseGuards(AuthGuard)
  async addGames(@Body() addGamesDto: AddGamesDto) {
    const games: Game[] = [];
    for (const gameId of addGamesDto.gameIds) {
      const game = await this.gamesService.findOne(gameId);
      games.push(game);
    }

    return this.gamelistsService.addGames(addGamesDto.gamelistId, games);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateGamelistDto: UpdateGamelistDto) {
    return await this.gamelistsService.update(id, updateGamelistDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.gamelistsService.remove(id);
  }
}
