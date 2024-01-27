import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gamelist } from './entities/gamelist.entity';
import { Like, Repository } from 'typeorm';
import { CreateGamelistDto } from './dtos/create-gamelist.dto';
import { UpdateGamelistDto } from './dtos/Update-gamelist.dto';

@Injectable()
export class GamelistsService {
  constructor(
    @InjectRepository(Gamelist) private gamelistsRepository: Repository<Gamelist>
  ) {}

  async find(query: string) {
    const title = query || '';
    return await this.gamelistsRepository.find({where: {title: Like(`%${title}%`)}});
  }

  async findOne(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const gamelist = await this.gamelistsRepository.findOne({where: {id}});
    if (!gamelist) {
      throw new NotFoundException('gamelist not found with given id');
    }

    return gamelist;
  }

  async create({ title }: CreateGamelistDto) {
    if (!title || title === '') {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    const gamelists = await this.gamelistsRepository.find({where: {title}});
    if (gamelists.length > 0) {
      throw new BadRequestException('gamelist already exists');
    }

    const gamelist = this.gamelistsRepository.create({title});
    return await this.gamelistsRepository.save(gamelist);
  }

  async update(id: number, newData: UpdateGamelistDto) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const gamelist = await this.gamelistsRepository.findOne({where: {id}});
    if (!gamelist) {
      throw new NotFoundException('gamelist not found with given id');
    }

    Object.assign(gamelist, newData);
    return await this.gamelistsRepository.save(gamelist);
  }

  async remove(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const gamelist = await this.gamelistsRepository.findOne({where: {id}});
    if (!gamelist) {
      throw new NotFoundException('gamelist not found with given id');
    }

    return await this.gamelistsRepository.remove(gamelist);
  }
}
