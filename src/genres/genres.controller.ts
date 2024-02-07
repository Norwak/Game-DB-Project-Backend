import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dtos/create-genre.dto';
import { UpdateGenreDto } from './dtos/update-genre.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { GenreDto } from './dtos/genre.dto';
import { AdminGuard } from '../guards/admin.guard';
import { BaseCrudController } from '../base-crud/base-crud.controller';
import { Genre } from './entities/genre.entity';

@Controller('genres')
@Serialize(GenreDto)
export class GenresController extends BaseCrudController<Genre> {
  constructor(
    private genresService: GenresService
  ) {
    super(genresService);
  }
}
