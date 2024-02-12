import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { BaseDictionaryService } from '../../common/base-dictionary/base-dictionary.service';

@Injectable()
export class GenresService extends BaseDictionaryService<Genre> {
  constructor(
    @InjectRepository(Genre) private genresRepository: Repository<Genre>
  ) {
    super(genresRepository);
  }
}
