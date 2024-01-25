import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Developer } from './entities/developer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeveloperDto } from './dtos/create-developer.dto';
import { UpdateDeveloperDto } from './dtos/update-developer.dto';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer) private developersRepository: Repository<Developer>
  ) {}

  async find(query: string) {
    const title = query || '';
    return await this.developersRepository.find({where: {title: Like(`%${title}%`)}});
  }

  async findOne(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const developer = await this.developersRepository.findOne({where: {id}});
    if (!developer) {
      throw new NotFoundException('developer not found with given id');
    }

    return developer;
  }

  async create({ title }: CreateDeveloperDto) {
    if (!title || title === '') {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    const developers = await this.developersRepository.find({where: {title}});
    if (developers.length > 0) {
      throw new BadRequestException('developer already exists');
    }

    const developer = this.developersRepository.create({title});
    return await this.developersRepository.save(developer);
  }

  async update(id: number, newData: UpdateDeveloperDto) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const developer = await this.developersRepository.findOne({where: {id}});
    if (!developer) {
      throw new NotFoundException('developer not found with given id');
    }

    Object.assign(developer, newData);
    return await this.developersRepository.save(developer);
  }

  async remove(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const developer = await this.developersRepository.findOne({where: {id}});
    if (!developer) {
      throw new NotFoundException('developer not found with given id');
    }

    return await this.developersRepository.remove(developer);
  }
}
