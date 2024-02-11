import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Developer } from './entities/developer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from '../../common/base-crud/base-crud.service';

@Injectable()
export class DevelopersService extends BaseCrudService<Developer> {
  constructor(
    @InjectRepository(Developer) private developersRepository: Repository<Developer>
  ) {
    super(developersRepository)
  }
}
