import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dtos/create-developer.dto';
import { UpdateDeveloperDto } from './dtos/update-developer.dto';

@Controller('developers')
export class DevelopersController {
  constructor(
    private developersService: DevelopersService
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.developersService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.developersService.findOne(id);
  }

  @Post()
  async create(@Body() createDeveloperDto: CreateDeveloperDto) {
    return await this.developersService.create(createDeveloperDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateDeveloperDto: UpdateDeveloperDto) {
    return await this.developersService.update(id, updateDeveloperDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.developersService.remove(id);
  }
}
