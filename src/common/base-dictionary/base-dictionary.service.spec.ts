import { Test, TestingModule } from '@nestjs/testing';
import { BaseDictionaryService } from './base-dictionary.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseDictionaryTestEntity } from './entities/base-dictionary-test.entity';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { GamesService } from '../../modules/games/games.service';
import { Game } from '../../modules/games/entities/game.entity';
import { Genre } from '../../modules/genres/entities/genre.entity';
import { Developer } from '../../modules/developers/entities/developer.entity';
import { Console } from '../../modules/consoles/entities/console.entity';

describe('BaseDictionaryService', () => {
  let baseDictionaryService: BaseDictionaryService<BaseDictionaryTestEntity>;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let fakeGamesService: Partial<GamesService>;
  const testGenres = [
    {id: 1, title: 'Action'} as Genre,
    {id: 2, title: 'Adventure'} as Genre,
  ];
  const testDevelopers = [
    {id: 1, title: 'Capcom'} as Developer,
    {id: 2, title: 'Konami'} as Developer,
  ];
  const testConsoles = [
    {id: 1, title: 'PS4'} as Console,
  ];

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    await dataSource.createQueryBuilder().insert().into(Genre).values(testGenres).execute();
    await dataSource.createQueryBuilder().insert().into(Developer).values(testDevelopers).execute();
    await dataSource.createQueryBuilder().insert().into(Console).values(testConsoles).execute();

    fakeGamesService = {
      findOne: jest.fn(),
      saveMeta: jest.fn(),
    };

    testingModule = await Test.createTestingModule({
      providers: [
        BaseDictionaryService,
        {
          provide: 'repository',
          useValue: dataSource.getRepository(BaseDictionaryTestEntity),
        },
        {
          provide: GamesService,
          useValue: fakeGamesService,
        },
      ],
    }).compile();

    baseDictionaryService = testingModule.get<BaseDictionaryService<BaseDictionaryTestEntity>>(BaseDictionaryService);
  });

  it('should be defined', () => {
    expect(baseDictionaryService).toBeDefined();
  });



  it('[find] should return an array of items matching search query #1', async () => {
    await baseDictionaryService.create({ title: 'Item #1' });

    const items = await baseDictionaryService.find('Item #1');
    expect(items.length).toEqual(1);
    expect(items[0].title).toEqual('Item #1');
  });

  it('[find] should return an array of items matching search query #2', async () => {
    await baseDictionaryService.create({ title: 'Item #1' });
    await baseDictionaryService.create({ title: 'Item #2' });
    await baseDictionaryService.create({ title: 'Test #3' });

    const items = await baseDictionaryService.find('item');
    expect(items.length).toEqual(2);
    expect(items[0].title).toEqual('Item #1');
    expect(items[1].title).toEqual('Item #2');
  });

  it('[find] should return an empty array if no results found', async () => {
    await baseDictionaryService.create({ title: 'Item #1' });
    await baseDictionaryService.create({ title: 'Item #2' });
    await baseDictionaryService.create({ title: 'Item #3' });

    const items = await baseDictionaryService.find('q');
    expect(items.length).toEqual(0);
  });



  it('[findSome] should return an array of items by ids', async () => {
    await baseDictionaryService.create({ title: 'Item #1' });
    await baseDictionaryService.create({ title: 'Item #2' });
    await baseDictionaryService.create({ title: 'Item #3' });

    const items = await baseDictionaryService.findSome([1, 2, 3]);
    expect(items.length).toEqual(3);
    expect(items[2].title).toEqual('Item #3');
  });

  it('[findSome] should return an empty array of items weren\'t found', async () => {
    const items = await baseDictionaryService.findSome([1, 2, 3]);
    expect(items.length).toEqual(0);
  });



  it('[findOne] should return an item with given id', async () => {
    const item = await baseDictionaryService.create({ title: 'Item #1' });
    const relations = [];

    const foundItem = await baseDictionaryService.findOne(item.id, relations);
    expect(foundItem.title).toEqual('Item #1');
  });

  it('[findOne] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    const relations = [];
    await expect(baseDictionaryService.findOne(12514, relations)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if item\'s id isn\'t valid', async () => {
    const relations = [];
    await expect(baseDictionaryService.findOne(-15, relations)).rejects.toThrow(BadRequestException);
    await expect(baseDictionaryService.findOne(undefined, relations)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create an item with given title and return it', async () => {
    const createdItem = await baseDictionaryService.create({ title: 'Item #1' });
    expect(createdItem.title).toEqual('Item #1');
  });

  it('[create] should throw a BadRequestException if item\'s name is invalid', async () => {
    await expect(baseDictionaryService.create({ title: '' })).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if item\'s name already exists', async () => {
    await baseDictionaryService.create({ title: 'Item #1' });
    await expect(baseDictionaryService.create({ title: 'Item #1' })).rejects.toThrow(BadRequestException);
  });



  it('[update] should update an item\'s data with given ID and return updated item', async () => {
    const item = await baseDictionaryService.create({ title: 'TIem #1' });
    const updatedItem = await baseDictionaryService.update(item.id, {title: 'Item #1'});
    expect(updatedItem.title).toEqual('Item #1');
  });

  it('[update] should throw a BadRequestException if item\'s id is invalid', async () => {
    const item = await baseDictionaryService.create({ title: 'TIem #1' });
    await expect(baseDictionaryService.update(-10, { title: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    await expect(baseDictionaryService.update(123, { title: '' })).rejects.toThrow(NotFoundException);
  });



  it('[remove] should delete an item with given ID and return it', async () => {
    const item = await baseDictionaryService.create({ title: 'Item #1' });
    const deletedItem = await baseDictionaryService.remove(item.id);
    expect(deletedItem).toBeDefined();
    expect(deletedItem.id).toEqual(undefined);
  });

  it('[remove] should throw a BadRequestException if item\'s id is invalid', async () => {
    await expect(baseDictionaryService.remove(undefined)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    await expect(baseDictionaryService.remove(123)).rejects.toThrow(NotFoundException);
  });



  it('[addtogame] should append genres to a game', async () => {
    fakeGamesService.findOne = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: [], developers: [], consoles: []
      } as Game);
    }

    // add genres
    fakeGamesService.saveMeta = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: testGenres, developers: [], consoles: []
      } as Game);
    }

    let addToGameDto = {
      gameId: 1,
      metaName: 'genres',
      metaIds: [1, 2],
    }
    let updatedGame = await baseDictionaryService.addtogame(addToGameDto);
    expect(updatedGame.title).toEqual("Castlevalia");
    expect(updatedGame.genres).toEqual(testGenres);
    expect(updatedGame.genres[0].id).toEqual(1);

    // add developers
    fakeGamesService.saveMeta = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: testGenres, developers: testDevelopers, consoles: []
      } as Game);
    }

    addToGameDto = {
      gameId: 1, metaName: 'developers', metaIds: [1, 2],
    }
    updatedGame = await baseDictionaryService.addtogame(addToGameDto);
    expect(updatedGame.genres).toEqual(testGenres);
    expect(updatedGame.developers).toEqual(testDevelopers);

    // add consoles
    fakeGamesService.saveMeta = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: testGenres, developers: testDevelopers, consoles: testConsoles
      } as Game);
    }
    
    addToGameDto = {
      gameId: 1, metaName: 'consoles', metaIds: [1],
    }
    updatedGame = await baseDictionaryService.addtogame(addToGameDto);
    expect(updatedGame.genres).toEqual(testGenres);
    expect(updatedGame.developers).toEqual(testDevelopers);
    expect(updatedGame.consoles).toEqual(testConsoles);
  });

  it('[addtogame] should check if meta exists and the game has it', async () => {
    fakeGamesService.findOne = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: [], developers: []
      } as Game);
    }

    let addToGameDto = {
      gameId: 1, metaName: 'none', metaIds: [1],
    }
    await expect(baseDictionaryService.addtogame(addToGameDto)).rejects.toThrow(BadRequestException);

    addToGameDto = {
      gameId: 1, metaName: 'console', metaIds: [1],
    }
    await expect(baseDictionaryService.addtogame(addToGameDto)).rejects.toThrow(BadRequestException);
  });



  it('[removefromgame] should append genres to a game', async () => {
    fakeGamesService.findOne = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: [], developers: [], consoles: []
      } as Game);
    }

    // add test data
    fakeGamesService.saveMeta = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: testGenres, developers: [], consoles: []
      } as Game);
    }

    let addToGameDto = {
      gameId: 1,
      metaName: 'genres',
      metaIds: [1, 2],
    }
    let updatedGame = await baseDictionaryService.addtogame(addToGameDto);

    // remove test data
    fakeGamesService.saveMeta = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: [], developers: [], consoles: []
      } as Game);
    }

    updatedGame = await baseDictionaryService.removefromgame(addToGameDto);
    expect(updatedGame.title).toEqual("Castlevalia");
    expect(updatedGame.genres).toEqual([]);
    expect(updatedGame.genres.length).toEqual(0);
  });

  it('[removefromgame] should check if meta exists and the game has it', async () => {
    fakeGamesService.findOne = () => {
      return Promise.resolve({
        id: 1, title: "Castlevalia", releaseDate: new Date('1995-12-17T03:24:00.000Z'),
        genres: [], developers: []
      } as Game);
    }

    let removeFromGameDto = {
      gameId: 1, metaName: 'none', metaIds: [1],
    }
    await expect(baseDictionaryService.removefromgame(removeFromGameDto)).rejects.toThrow(BadRequestException);

    removeFromGameDto = {
      gameId: 1, metaName: 'console', metaIds: [1],
    }
    await expect(baseDictionaryService.removefromgame(removeFromGameDto)).rejects.toThrow(BadRequestException);
  });
});
