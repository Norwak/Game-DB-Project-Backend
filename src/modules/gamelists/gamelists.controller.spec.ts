import { Test, TestingModule } from '@nestjs/testing';
import { GamelistsController } from './gamelists.controller';
import { GamelistsService } from './gamelists.service';
import { Gamelist } from './entities/gamelist.entity';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { GamesService } from '../games/games.service';
import { Game } from '../games/entities/game.entity';

describe('GamelistsController', () => {
  let gamelistsController: GamelistsController;
  let fakeGamelistsService: Partial<GamelistsService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeGamelistsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      userGamelists: jest.fn(),
      gameGamelists: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    fakeUsersService = {
      findOne: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamelistsController],
      providers: [
        {
          provide: GamelistsService,
          useValue: fakeGamelistsService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ]
    }).compile();

    gamelistsController = module.get<GamelistsController>(GamelistsController);
  });



  it('should be defined', () => {
    expect(gamelistsController).toBeDefined();
  });



  it('[find] should return an array with gamelists that match search query', async () => {
    fakeGamelistsService.find = () => {
      return Promise.resolve([{id: 1, title: 'My list'} as Gamelist]);
    }

    const gamelist = await gamelistsController.find('My');
    expect(gamelist.length).toEqual(1);
  });



  it('[findOne] should return the gamelist with given id', async () => {
    fakeGamelistsService.findOne = () => {
      return Promise.resolve({id: 1, title: 'My list'} as Gamelist);
    }

    const gamelist = await gamelistsController.findOne(1);
    expect(gamelist.title).toEqual('My list');
  });



  it('[userGamelists] should return array of gamelists owned by user with given ID', async () => {
    fakeGamelistsService.userGamelists = () => {
      return Promise.resolve([
        {
          id: 1,
          title: 'My list',
          games: [
            {id: 4, title: 'Mario'} as Game,
            {id: 3, title: 'Megaman'} as Game,
            {id: 2, title: 'Castlevania'} as Game,
            {id: 1, title: 'Battletoads'} as Game,
          ]
        } as Gamelist,
      ]);
    }

    const userId = 1;
    const gamelists = await gamelistsController.userGamelists(userId);
    expect(gamelists.length).toEqual(1);
    expect(gamelists[0].games.length).toEqual(4);
  });



  it('[gameGamelists] should return array of gamelists that have a game with given ID', async () => {
    fakeGamelistsService.userGamelists = () => {
      return Promise.resolve([
        {
          id: 1,
          title: 'My list',
          games: [
            {id: 4, title: 'Mario'} as Game,
            {id: 3, title: 'Megaman'} as Game,
            {id: 2, title: 'Castlevania'} as Game,
            {id: 1, title: 'Battletoads'} as Game,
          ]
        } as Gamelist,
      ]);
    }

    const gameId = 1;
    const gamelists = await gamelistsController.gameGamelists(gameId);
    expect(gamelists.length).toEqual(1);
    expect(gamelists[0].games.length).toEqual(4);
  });



  it('[create] should return a gamelist back with assigned id', async () => {
    const user = {
      id: 1,
      nickname: 'Joel',
    } as User;

    fakeUsersService.findOne = () => {
      return Promise.resolve(user);
    }

    fakeGamelistsService.create = () => {
      return Promise.resolve({id: 1, title: 'My list', user} as Gamelist);
    }

    const session: Record<string, any> = {userId: 1};
    const gamelist = await gamelistsController.create({title: 'My list'}, session);
    expect(gamelist).toHaveProperty('id');
    expect(gamelist.user.id).toEqual(1);
  });

  it('[create] should throw BadRequestException if title isn\'t valid', async () => {
    fakeGamelistsService.create = () => {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    const session = {userId: 1};
    await expect(gamelistsController.create({title: undefined}, session)).rejects.toThrow(BadRequestException);
  });



  it('[update] should return a gamelist with updated data', async () => {
    fakeGamelistsService.update = () => {
      return Promise.resolve({id: 1, title: 'My list'} as Gamelist);
    }

    const session: Record<string, any> = {userId: 1};
    const updatedGamelist = await gamelistsController.update(1, {title: 'My list'}, session);
    expect(updatedGamelist.id).toEqual(1);
    expect(updatedGamelist.title).toEqual('My list');
  });



  it('[remove] should delete a gamelist by id and return gamelist object back without id', async () => {
    fakeGamelistsService.remove = () => {
      return Promise.resolve({title: 'My list'} as Gamelist);
    }

    const session: Record<string, any> = {userId: 1};
    const deletedGamelist = await gamelistsController.remove(1, session);
    expect(deletedGamelist.title).toEqual('My list');
    expect(deletedGamelist).not.toHaveProperty('id');
  });
});
