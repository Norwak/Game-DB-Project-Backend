import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gamelist } from './entities/gamelist.entity';
import { In, Like, Repository } from 'typeorm';
import { CreateGamelistDto } from './dtos/create-gamelist.dto';
import { UpdateGamelistDto } from './dtos/Update-gamelist.dto';
import { GamesService } from '../games/games.service';
import { AddGamesDto } from './dtos/add-games.dto';
import { RemoveGamesDto } from './dtos/remove-games.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class GamelistsService {
  constructor(
    @InjectRepository(Gamelist) private gamelistsRepository: Repository<Gamelist>,
    private gamesService: GamesService,
    private usersService: UsersService
  ) {}

  async find(query: string) {
    const title = query || '';
    return await this.gamelistsRepository.find({where: {title: Like(`%${title}%`)}, order: {games: {id: "DESC"}}, relations: ['games']});
  }

  async findSome(ids: number[]) {
    return await this.gamelistsRepository.find({where: {id: In(ids)}, order: {games: {id: "DESC"}}, relations: ['games']});
  }

  async findOne(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const gamelist = await this.gamelistsRepository.findOne({where: {id}, order: {games: {id: "DESC"}}, relations: ['games']});
    if (!gamelist) {
      throw new NotFoundException('gamelist not found with given id');
    }

    return gamelist;
  }

  async userGamelists(userId: number) {
    return await this.gamelistsRepository.createQueryBuilder('gamelist')
      .leftJoinAndSelect('gamelist.games', 'game')
      .where('gamelist.userId = :userId', {userId})
      .orderBy('game.id', 'DESC')
      .getMany();
  }

  async gameGamelists(gameId: number) {
    const gamelists = await this.gamelistsRepository.createQueryBuilder('gamelist')
    .leftJoinAndSelect('gamelist.games', 'game')
    .where('game.id = :gameId', {gameId})
    .getMany();

    const ids = gamelists.map(item => item.id);
    return await this.findSome(ids);
  }

  async create({ title }: CreateGamelistDto, session: Record<string, any>) {
    if (!title || title === '') {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    const user = await this.usersService.findOne(session.userId);
    const gamelist = this.gamelistsRepository.create({title});
    gamelist.user = user;
    return await this.gamelistsRepository.save(gamelist);
  }

  async update(id: number, newData: UpdateGamelistDto, session: Record<string, any>) {
    const gamelist = await this.findOne(id);

    const targetUser = await this.usersService.findOne(gamelist.user.id);
    const currentUser = await this.usersService.findOne(session.userId);
    if (!currentUser.isAdmin && currentUser.id !== targetUser.id) {
      throw new ForbiddenException();
    }

    
    Object.assign(gamelist, newData);
    return await this.gamelistsRepository.save(gamelist);
  }

  async remove(id: number, session: Record<string, any>) {
    const gamelist = await this.findOne(id);

    const targetUser = await this.usersService.findOne(gamelist.user.id);
    const currentUser = await this.usersService.findOne(session.userId);
    if (!currentUser.isAdmin && currentUser.id !== targetUser.id) {
      throw new ForbiddenException();
    }

    return await this.gamelistsRepository.remove(gamelist);
  }



  async addGames({gamelistId, gameIds}: AddGamesDto, session: Record<string, any>) {
    const games = await this.gamesService.findSome(gameIds);
    const gamelist = await this.findOne(gamelistId);

    const targetUser = await this.usersService.findOne(gamelist.user.id);
    const currentUser = await this.usersService.findOne(session.userId);
    if (!currentUser.isAdmin && currentUser.id !== targetUser.id) {
      throw new ForbiddenException();
    }

    const ids = new Set(gamelist.games.map((game) => game.id));
    gamelist.games = [...gamelist.games, ...games.filter((game) => !ids.has(game.id))];

    return await this.gamelistsRepository.save(gamelist);
  }

  async removeGames({gamelistId, gameIds}: RemoveGamesDto, session: Record<string, any>) {
    const gamelist = await this.findOne(gamelistId);

    const targetUser = await this.usersService.findOne(gamelist.user.id);
    const currentUser = await this.usersService.findOne(session.userId);
    if (!currentUser.isAdmin && currentUser.id !== targetUser.id) {
      throw new ForbiddenException();
    }

    const ids = new Set(gameIds);
    gamelist.games = [...gamelist.games.filter((game) => !ids.has(game.id))];

    return await this.gamelistsRepository.save(gamelist);
  }
}
