import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GamelistsService } from './gamelists.service';
import { CreateGamelistDto } from './dtos/create-gamelist.dto';
import { UpdateGamelistDto } from './dtos/Update-gamelist.dto';

@Controller('gamelists')
export class GamelistsController {
  constructor(
    private gamelistsService: GamelistsService
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
  async create(@Body() createGamelistDto: CreateGamelistDto) {
    return await this.gamelistsService.create(createGamelistDto);
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
