import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Like, Repository } from 'typeorm';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { Genre } from '../genres/entities/genre.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gamesRepository: Repository<Game>
  ) {}

  async find(query: string) {
    const title = query || '';
    return await this.gamesRepository.find({where: {title: Like(`%${title}%`)}});
  }

  async findOne(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const game = await this.gamesRepository.findOne({where: {id}, relations: ['genres']});
    if (!game) {
      throw new NotFoundException('game not found with given id');
    }

    return game;
  }

  async create({ title, releaseDate }: CreateGameDto) {
    if (!title || title === '') {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    if (!releaseDate) {
      throw new BadRequestException('release date shouldn\'t be empty');
    }

    if (releaseDate.getFullYear() < 1950) {
      throw new BadRequestException('release date is too old');
    }

    const games = await this.gamesRepository.find({where: {title}});
    if (games.length > 0) {
      throw new BadRequestException('game already exists');
    }

    const game = this.gamesRepository.create({title, releaseDate});
    return await this.gamesRepository.save(game);
  }

  async update(id: number, newData: Partial<UpdateGameDto>) {
    const game = await this.findOne(id);
    Object.assign(game, newData);
    return await this.gamesRepository.save(game);
  }

  async remove(id: number) {
    const game = await this.findOne(id);
    return await this.gamesRepository.remove(game);
  }



  async addGenres(gameId: number, genres: Genre[]) {
    const game = await this.findOne(gameId);

    const ids = new Set(game.genres.map(genre => genre.id));
    game.genres = [...game.genres, ...genres.filter(genre => !ids.has(genre.id))];
    
    return await this.gamesRepository.save(game);
  }
}