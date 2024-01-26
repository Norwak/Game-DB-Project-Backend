import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dtos/create-genre.dto';
import { UpdateGenreDto } from './dtos/update-genre.dto';

@Controller('genres')
export class GenresController {
  constructor(
    private genresService: GenresService
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.genresService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.genresService.findOne(id);
  }

  @Post()
  async create(@Body() createDeveloperDto: CreateGenreDto) {
    return await this.genresService.create(createDeveloperDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateDeveloperDto: UpdateGenreDto) {
    return await this.genresService.update(id, updateDeveloperDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.genresService.remove(id);
  }
}
