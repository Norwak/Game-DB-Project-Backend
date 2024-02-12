import { Injectable } from '@nestjs/common';
import { BaseDictionaryService } from '../../common/base-dictionary/base-dictionary.service';
import { Console } from './entities/console.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamesService } from '../games/games.service';

@Injectable()
export class ConsolesService extends BaseDictionaryService<Console> {
  constructor(
    @InjectRepository(Console) protected consolesRepository: Repository<Console>,
    protected gamesService: GamesService
  ) {
    super(consolesRepository, gamesService);
  }
}
