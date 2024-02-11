import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '../../common/base-crud/base-crud.service';
import { Console } from './entities/console.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ConsolesService extends BaseCrudService<Console> {
  constructor(
    @InjectRepository(Console) private consolesRepository: Repository<Console>,
  ) {
    super(consolesRepository);
  }
}
