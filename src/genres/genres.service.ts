import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../base-crud/base-crud.service';

@Injectable()
export class GenresService extends BaseCrudService<Genre> {
  constructor(
    @InjectRepository(Genre) private genresRepository: Repository<Genre>
  ) {
    super(genresRepository);
  }
}
