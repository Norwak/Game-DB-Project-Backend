import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { BaseDictionaryService } from '../../common/base-dictionary/base-dictionary.service';
import { GamesService } from '../games/games.service';

@Injectable()
export class GenresService extends BaseDictionaryService<Genre> {
  constructor(
    @InjectRepository(Genre) protected genresRepository: Repository<Genre>,
    protected gamesService: GamesService
  ) {
    super(genresRepository, gamesService);
  }
}
