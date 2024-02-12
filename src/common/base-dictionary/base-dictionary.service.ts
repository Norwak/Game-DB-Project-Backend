import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { BaseDictionaryEntity } from './entities/base-dictionary.entity';
import { CreateBaseDictionaryDto } from './dtos/create-base-dictionary.dto';
import { UpdateBaseDictionaryDto } from './dtos/update-base-dictionary.dto';

export class BaseDictionaryService<T extends BaseDictionaryEntity> {
  constructor(
    @Inject('repository') private repository: Repository<T>
  ) {}

  async find(query: string) {
    const title = query || '';
    return await this.repository.find({where: {title: Like(`%${title}%`)} as FindOptionsWhere<T>});
  }

  async findSome(ids: number[]) {
    return await this.repository.find({where: {id: In(ids)} as FindOptionsWhere<T>});
  }

  async findOne(id: number, relations: string[] = ['games']) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const item = await this.repository.findOne({where: {id} as FindOptionsWhere<T>, relations});
    if (!item) {
      throw new NotFoundException('item not found with given id');
    }

    return item;
  }

  async create({title}: CreateBaseDictionaryDto) {
    if (!title || title === '') {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    const items = await this.repository.find({where: {title} as FindOptionsWhere<T>});
    if (items.length > 0) {
      throw new BadRequestException('item already exists');
    }

    const item = this.repository.create({title} as T);
    return await this.repository.save(item);
  }

  async update(id: number, newData: UpdateBaseDictionaryDto) {
    const relations = [];
    const item = await this.findOne(id, relations);
    Object.assign(item, newData);
    return await this.repository.save(item);
  }

  async remove(id: number) {
    const relations = [];
    const genre = await this.findOne(id, relations);
    return await this.repository.remove(genre);
  }
}
