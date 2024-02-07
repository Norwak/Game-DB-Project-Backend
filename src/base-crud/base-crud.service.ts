import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { BaseCrudEntity } from './entitites/base-crud.entity';
import { CreateBaseCrudDto } from './dtos/create-base-crud.dto';
import { UpdateBaseCrudDto } from './dtos/update-base-crud.dto';

export class BaseCrudService<T extends BaseCrudEntity> {
  constructor(
    private repository: Repository<T>
  ) {}

  async find(query: string) {
    const title = query || '';
    return await this.repository.find({where: {title: Like(`%${title}%`)} as FindOptionsWhere<T>});
  }

  async findSome(ids: number[]) {
    return await this.repository.find({where: {id: In(ids)} as FindOptionsWhere<T>});
  }

  async findOne(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const genre = await this.repository.findOne({where: {id} as FindOptionsWhere<T>, relations: ['games']});
    if (!genre) {
      throw new NotFoundException('genre not found with given id');
    }

    return genre;
  }

  async create({title}: CreateBaseCrudDto) {
    if (!title || title === '') {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    const genres = await this.repository.find({where: {title} as FindOptionsWhere<T>});
    if (genres.length > 0) {
      throw new BadRequestException('genre already exists');
    }

    const genre = this.repository.create({title} as T);
    return await this.repository.save(genre);
  }

  async update(id: number, newData: UpdateBaseCrudDto) {
    const genre = await this.findOne(id);
    Object.assign(genre, newData);
    return await this.repository.save(genre);
  }

  async remove(id: number) {
    const genre = await this.findOne(id);
    return await this.repository.remove(genre);
  }
}
