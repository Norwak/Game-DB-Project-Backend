import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dtos/create-genre.dto';
import { UpdateGenreDto } from './dtos/update-genre.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { GenreDto } from './dtos/genre.dto';
import { AdminGuard } from '../guards/admin.guard';

@Controller('genres')
@Serialize(GenreDto)
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
  @UseGuards(AdminGuard)
  async create(@Body() createDeveloperDto: CreateGenreDto) {
    return await this.genresService.create(createDeveloperDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: number, @Body() updateDeveloperDto: UpdateGenreDto) {
    return await this.genresService.update(id, updateDeveloperDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number) {
    return await this.genresService.remove(id);
  }
}
