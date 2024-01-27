import { Test, TestingModule } from '@nestjs/testing';
import { GamelistsController } from './gamelists.controller';
import { GamelistsService } from './gamelists.service';
import { Gamelist } from './entities/gamelist.entity';
import { CreateGamelistDto } from './dtos/create-gamelist.dto';
import { BadRequestException } from '@nestjs/common';

describe('GamelistsController', () => {
  let gamelistsController: GamelistsController;
  let fakeGamelistsService: Partial<GamelistsService>;

  beforeEach(async () => {
    fakeGamelistsService = {
      find: (query: string) => {
        return Promise.resolve([{
          id: 1,
          title: 'some title'
        } as Gamelist]);
      },
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          title: 'some title'
        } as Gamelist);
      },
      create: (item: CreateGamelistDto) => {
        return Promise.resolve({
          id: 1,
          title: item.title
        } as Gamelist);
      },
      update: (id: number, newData: Partial<Gamelist>) => {
        return Promise.resolve({
          id,
          title: newData.title
        } as Gamelist);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          title: 'some title'
        } as Gamelist);
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamelistsController],
      providers: [
        {
          provide: GamelistsService,
          useValue: fakeGamelistsService,
        }
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
    fakeGamelistsService.create = () => {
      return Promise.resolve({id: 1, title: 'My list'} as Gamelist);
    }

    const gamelist = await gamelistsController.create({title: 'My list'});
    expect(gamelist).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if title isn\'t valid', async () => {
    fakeGamelistsService.create = () => {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    await expect(gamelistsController.create({title: undefined})).rejects.toThrow(BadRequestException);
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
