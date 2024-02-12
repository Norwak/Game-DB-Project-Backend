import { Injectable } from '@nestjs/common';
import { BaseDictionaryService } from '../../common/base-dictionary/base-dictionary.service';
import { Console } from './entities/console.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ConsolesService extends BaseDictionaryService<Console> {
  constructor(
    @InjectRepository(Console) private consolesRepository: Repository<Console>,
  ) {
    super(consolesRepository);
  }
}
