import { Test, TestingModule } from '@nestjs/testing';
import { BaseDictionaryController } from './base-dictionary.controller';
import { BaseDictionaryEntity } from './entities/base-dictionary.entity';
import { BaseDictionaryService } from './base-dictionary.service';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { User } from '../../modules/users/entities/user.entity';
import { Game } from '../../modules/games/entities/game.entity';

describe('BaseDictionaryController', () => {
  let baseDictionaryController: BaseDictionaryController<BaseDictionaryEntity>;
  let fakeBaseDictionaryService: Partial<BaseDictionaryService<BaseDictionaryEntity>>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeBaseDictionaryService = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      addtogame: jest.fn(),
      removefromgame: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    fakeUsersService = {
      findOne: () => {
        return Promise.resolve({
          isAdmin: true
        } as User);
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseDictionaryController],
      providers: [
        {
          provide: 'service',
          useValue: fakeBaseDictionaryService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ]
    }).compile();

    baseDictionaryController = module.get<BaseDictionaryController<BaseDictionaryEntity>>(BaseDictionaryController);
  });

  it('should be defined', () => {
    expect(baseDictionaryController).toBeDefined();
  });



  it('[find] should return an array with items that match search query', async () => {
    fakeBaseDictionaryService.find = () => {
      return Promise.resolve([{id: 1, title: 'Action'} as BaseDictionaryEntity]);
    }

    const items = await baseDictionaryController.find('Ion');
    expect(items.length).toEqual(1);
  });



  it('[findOne] should return the item with given id', async () => {
    fakeBaseDictionaryService.findOne = () => {
      return Promise.resolve({id: 1, title: 'Action'} as BaseDictionaryEntity);
    }

    const item = await baseDictionaryController.findOne(1);
    expect(item.title).toEqual('Action');
  });



  it('[create] should return an item back with assigned id', async () => {
    fakeBaseDictionaryService.create = () => {
      return Promise.resolve({id: 1, title: 'Action'} as BaseDictionaryEntity);
    }

    const item = await baseDictionaryController.create({title: 'Action'});
    expect(item).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if title isn\'t valid', async () => {
    fakeBaseDictionaryService.create = () => {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    await expect(baseDictionaryController.create({title: undefined})).rejects.toThrow(BadRequestException);
  });



  it('[addtogame] should return empty object if meta insertion was correct', async () => {
    fakeBaseDictionaryService.addtogame = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: [
          {id: 1, title: 'Action'},
          {id: 2, title: 'Adventure'},
        ], developers: [], consoles: []
      } as Game);
    }

    const gameId = 1;
    const metaName = 'genres';
    const metaIds = [1, 2];

    const result = await baseDictionaryController.addtogame({gameId, metaName, metaIds});
    expect(result).toEqual({});
  });



  it('[removefromgame] should return empty object if meta removal was correct', async () => {
    fakeBaseDictionaryService.removefromgame = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: [], developers: [], consoles: []
      } as Game);
    }

    const gameId = 1;
    const metaName = 'genres';
    const metaIds = [1, 2];

    const result = await baseDictionaryController.removefromgame({gameId, metaName, metaIds});
    expect(result).toEqual({});
  });



  it('[update] should return an item with updated data', async () => {
    fakeBaseDictionaryService.update = () => {
      return Promise.resolve({id: 1, title: 'Action'} as BaseDictionaryEntity);
    }

    const updatedItem = await baseDictionaryController.update(1, {title: 'Action'});
    expect(updatedItem.id).toEqual(1);
    expect(updatedItem.title).toEqual('Action');
  });



  it('[remove] should delete an item by id and return it\'s object back without id', async () => {
    fakeBaseDictionaryService.remove = () => {
      return Promise.resolve({title: 'Action'} as BaseDictionaryEntity);
    }

    const deletedItem = await baseDictionaryController.remove(1);
    expect(deletedItem.title).toEqual('Action');
    expect(deletedItem).not.toHaveProperty('id');
  });
});
