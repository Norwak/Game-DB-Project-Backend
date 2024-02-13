import { Body, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { BaseDictionaryService } from "./base-dictionary.service";
import { BaseDictionaryEntity } from "./entities/base-dictionary.entity";
import { CreateBaseDictionaryDto } from "./dtos/create-base-dictionary.dto";
import { UpdateBaseDictionaryDto } from "./dtos/update-base-dictionary.dto";
import { AdminGuard } from "../../guards/admin.guard";
import { AddToGameDto } from "./dtos/add-to-game.dto";
import { RemoveFromGameDto } from "./dtos/remove-from-game.dto";

export class BaseDictionaryController<T extends BaseDictionaryEntity> {
  constructor(
    @Inject('service') private service: BaseDictionaryService<T>
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.service.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.service.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createDeveloperDto: CreateBaseDictionaryDto) {
    return await this.service.create(createDeveloperDto);
  }

  @Patch('addtogame')
  @UseGuards(AdminGuard)
  async addtogame(@Body() addToGameDto: AddToGameDto) {
    await this.service.addtogame(addToGameDto);
    return {};
  }

  @Patch('removefromgame')
  @UseGuards(AdminGuard)
  async removefromgame(@Body() removeFromGameDto: RemoveFromGameDto) {
    await this.service.removefromgame(removeFromGameDto);
    return {};
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: number, @Body() updateDeveloperDto: UpdateBaseDictionaryDto) {
    return await this.service.update(id, updateDeveloperDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number) {
    return await this.service.remove(id);
  }
}
