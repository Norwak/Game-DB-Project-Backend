import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { GamelistsService } from './gamelists.service';
import { CreateGamelistDto } from './dtos/create-gamelist.dto';
import { UpdateGamelistDto } from './dtos/Update-gamelist.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UsersService } from '../users/users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { GamelistDto } from './dtos/gamelist.dto';

@Controller('gamelists')
@Serialize(GamelistDto)
export class GamelistsController {
  constructor(
    private gamelistsService: GamelistsService,
    private usersService: UsersService
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

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateGamelistDto: UpdateGamelistDto) {
    return await this.gamelistsService.update(id, updateGamelistDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.gamelistsService.remove(id);
  }
}
