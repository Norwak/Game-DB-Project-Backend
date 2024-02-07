import { Test, TestingModule } from '@nestjs/testing';
import { GamelistsController } from './gamelists.controller';
import { GamelistsService } from './gamelists.service';
import { Gamelist } from './entities/gamelist.entity';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { GamesService } from '../games/games.service';

describe('GamelistsController', () => {
  let gamelistsController: GamelistsController;
  let fakeGamelistsService: Partial<GamelistsService>;
  let fakeUsersService: Partial<UsersService>;
  let fakeGamesService: Partial<GamesService>;

  beforeEach(async () => {
    fakeGamelistsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    fakeUsersService = {
      findOne: jest.fn(),
    }

    fakeGamesService = {
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
        {
          provide: GamesService,
          useValue: fakeGamesService,
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

    const session = {userId: 1};
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

    const updatedGamelist = await gamelistsController.update(1, {title: 'My list'});
    expect(updatedGamelist.id).toEqual(1);
    expect(updatedGamelist.title).toEqual('My list');
  });



  it('[remove] should delete a develper by id and return gamelist object back without id', async () => {
    fakeGamelistsService.remove = () => {
      return Promise.resolve({title: 'My list'} as Gamelist);
    }

    const deletedGamelist = await gamelistsController.remove(1);
    expect(deletedGamelist.title).toEqual('My list');
    expect(deletedGamelist).not.toHaveProperty('id');
  });
});
