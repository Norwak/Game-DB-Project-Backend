import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { In, Like, Repository } from 'typeorm';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { SaveGameMetaDto } from './dtos/save-game-meta.dto';
import { dictionaryList } from '../../common/dictionary.list';
import { SearchGamesDto } from './dtos/search-games.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gamesRepository: Repository<Game>
  ) {}

  async search({title, years, genres, developers, consoles, page}: SearchGamesDto) {
    page = page || 1;

    const stmt = this.gamesRepository.createQueryBuilder('game')
      .leftJoinAndSelect('game.genres', 'genre')
      .leftJoinAndSelect('game.developers', 'developer')
      .leftJoinAndSelect('game.consoles', 'console')
      .where('1 = 1');

    if (title) {
      stmt.andWhere('game.title LIKE :title', {title: `%${title}%`});
    }
    if (years) {
      stmt.andWhere(`strftime("%Y", game.releaseDate) IN (:...years)`, {years})
    }
    if (genres) {
      genres = genres.map(Number);
      stmt.andWhere('genre.id IN (:...genres)', {genres})
    }
    if (developers) {
      developers = developers.map(Number);
      stmt.andWhere('developer.id IN (:...developers)', {developers})
    }
    if (consoles) {
      consoles = consoles.map(Number);
      stmt.andWhere('console.id IN (:...consoles)', {consoles})
    }
    return stmt
      .skip((page - 1) * 30)
      .take(30)
      // .getQueryAndParameters();
      .getMany();
  }

  async alphabet(word: string) {
    if (!word) {
      return Promise.resolve([]);
    };

    return await this.gamesRepository.find({where: {title: Like(`${word}%`)}});
  }

  async find(query: string) {
    const title = query || '';
    return await this.gamesRepository.find({where: {title: Like(`%${title}%`)}});
  }

  async findSome(ids: number[]) {
    return await this.gamesRepository.find({where: {id: In(ids)}});
  }

  async findOne(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const game = await this.gamesRepository.findOne({where: {id}, relations: dictionaryList});
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
    const title = newData.title;
    if (title) {
      const games = await this.gamesRepository.find({where: {title}});
      if (games.length > 0) {
        throw new BadRequestException('game already exists');
      }
    }

    const game = await this.findOne(id);
    Object.assign(game, newData);
    return await this.gamesRepository.save(game);
  }

  async remove(id: number) {
    const game = await this.findOne(id);
    return await this.gamesRepository.remove(game);
  }



  async saveMeta(saveGameMetaDto: SaveGameMetaDto) {
    return await this.gamesRepository.save(saveGameMetaDto);
  }
}
