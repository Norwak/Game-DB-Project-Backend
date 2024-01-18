import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Developer } from './entities/developer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer) private developersRepository: Repository<Developer>
  ) {}

  async create(title: string) {
    if (!title || title === '') {
      return null;
    }

    if (await this.developersRepository.find({where: {title}})) {
      return null;
    }

    const developer = this.developersRepository.create({title});
    return await this.developersRepository.save(developer);
  }

  async remove(id: number) {
    if (!id) {
      return null;
    }

    const developer = await this.developersRepository.findOne({where: {id}});

    if (!developer) {
      return null;
    }

    return await this.developersRepository.remove(developer);
  }
}
