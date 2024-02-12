import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Developer } from './entities/developer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDictionaryService } from '../../common/base-dictionary/base-dictionary.service';
import { GamesService } from '../games/games.service';

@Injectable()
export class DevelopersService extends BaseDictionaryService<Developer> {
  constructor(
    @InjectRepository(Developer) protected developersRepository: Repository<Developer>,
    protected gamesService: GamesService
  ) {
    super(developersRepository, gamesService)
  }
}
