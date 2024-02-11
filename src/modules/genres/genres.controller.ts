import { Controller } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenreDto } from './dtos/genre.dto';
import { Genre } from './entities/genre.entity';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { BaseCrudController } from '../../common/base-crud/base-crud.controller';

@Controller('genres')
@Serialize(GenreDto)
export class GenresController extends BaseCrudController<Genre> {
  constructor(
    private genresService: GenresService
  ) {
    super(genresService);
  }
}
