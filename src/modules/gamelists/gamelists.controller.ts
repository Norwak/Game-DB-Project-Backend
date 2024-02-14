import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { GamelistsService } from './gamelists.service';
import { CreateGamelistDto } from './dtos/create-gamelist.dto';
import { UpdateGamelistDto } from './dtos/Update-gamelist.dto';
import { UsersService } from '../users/users.service';
import { GamelistDto } from './dtos/gamelist.dto';
import { AddGamesDto } from './dtos/add-games.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { AuthGuard } from '../../guards/auth.guard';
import { RemoveGamesDto } from './dtos/remove-games.dto';

@Controller('gamelists')
@Serialize(GamelistDto)
export class GamelistsController {
  constructor(
    private gamelistsService: GamelistsService,
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.gamelistsService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.gamelistsService.findOne(id);
  }

  @Get('user/:id')
  async userGamelists(@Param('id') userId: number) {
    return await this.gamelistsService.userGamelists(userId);
  }

  @Get('game/:id')
  async gameGamelists(@Param('id') gameId: number) {
    return await this.gamelistsService.userGamelists(gameId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createGamelistDto: CreateGamelistDto, @Session() session: Record<string, any>) {
    return await this.gamelistsService.create(createGamelistDto, session);
  }

  @Patch('addgames')
  @UseGuards(AuthGuard)
  async addGames(@Body() addGamesDto: AddGamesDto, @Session() session: Record<string, any>) {
    return this.gamelistsService.addGames(addGamesDto, session);
  }

  @Patch('removegames')
  @UseGuards(AuthGuard)
  async removeGames(@Body() removeGamesDto: RemoveGamesDto, @Session() session: Record<string, any>) {
    return this.gamelistsService.removeGames(removeGamesDto, session);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() updateGamelistDto: UpdateGamelistDto, @Session() session: Record<string, any>) {
    return await this.gamelistsService.update(id, updateGamelistDto, session);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number, @Session() session: Record<string, any>) {
    return await this.gamelistsService.remove(id, session);
  }
}
