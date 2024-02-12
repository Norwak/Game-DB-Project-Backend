import { Body, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { BaseDictionaryService } from "./base-dictionary.service";
import { BaseDictionaryEntity } from "./entities/base-dictionary.entity";
import { CreateBaseDictionaryDto } from "./dtos/create-base-dictionary.dto";
import { UpdateBaseDictionaryDto } from "./dtos/update-base-dictionary.dto";
import { AdminGuard } from "../../guards/admin.guard";

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