import { Test, TestingModule } from '@nestjs/testing';
import { GamelistsService } from './gamelists.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gamelist } from './entities/gamelist.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('GamelistsService', () => {
  let gamelistsService: GamelistsService;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let testUser = {
    id: 1,
    nickname: 'Joel',
  } as User;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    testingModule = await Test.createTestingModule({
      providers: [
        GamelistsService,
        {
          provide: getRepositoryToken(Gamelist),
          useValue: dataSource.getRepository(Gamelist),
        },
      ],
    }).compile();

    gamelistsService = testingModule.get<GamelistsService>(GamelistsService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(gamelistsService).toBeDefined();
  });



  it('[find] should return an array of gamelists matching search query #1', async () => {
    await gamelistsService.create({ title: 'My list' }, testUser);

    const gamelists = await gamelistsService.find('My list');
    expect(gamelists.length).toEqual(1);
    expect(gamelists[0].title).toEqual('My list');
  });

  it('[find] should return an array of gamelists matching search query #2', async () => {
    await gamelistsService.create({ title: 'My list' }, testUser);
    await gamelistsService.create({ title: 'Best games' }, testUser);
    await gamelistsService.create({ title: 'Backlog' }, testUser);

    const gamelists = await gamelistsService.find('m');
    expect(gamelists.length).toEqual(2);
    expect(gamelists[0].title).toEqual('My list');
    expect(gamelists[1].title).toEqual('Best games');
  });

  it('[find] should return an empty array', async () => {
    await gamelistsService.create({ title: 'My list' }, testUser);
    await gamelistsService.create({ title: 'Best games' }, testUser);
    await gamelistsService.create({ title: 'Backlog' }, testUser);

    const gamelists = await gamelistsService.find('q');
    expect(gamelists.length).toEqual(0);
  });



  it('[findOne] should return a gamelist with given id', async () => {
    const gamelist = await gamelistsService.create({ title: 'My list' }, testUser);

    const foundGamelist = await gamelistsService.findOne(gamelist.id);
    expect(foundGamelist.title).toEqual('My list');
  });

  it('[findOne] should throw a NotFoundException if gamelist\'s id doesn\'t exist', async () => {
    await expect(gamelistsService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if gamelist\'s id isn\'t valid', async () => {
    await expect(gamelistsService.findOne(-15)).rejects.toThrow(BadRequestException);
    await expect(gamelistsService.findOne(undefined)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create a gamelist with given title and return them', async () => {
    const createdGamelist = await gamelistsService.create({ title: 'My list' }, testUser);
    expect(createdGamelist.title).toEqual('My list');
    expect(createdGamelist.creationDate.getFullYear()).toEqual(new Date().getFullYear());
    expect(createdGamelist.lastUpdated.getFullYear()).toEqual(new Date().getFullYear());
    expect(createdGamelist.user.id).toEqual(1);
  });

  it('[create] should throw a BadRequestException if gamelist\'s name is invalid', async () => {
    await expect(gamelistsService.create({ title: '' }, testUser)).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if gamelist\'s name already exists', async () => {
    await gamelistsService.create({ title: 'My list' }, testUser);
    await expect(gamelistsService.create({ title: 'My list' }, testUser)).rejects.toThrow(BadRequestException);
  });



  it('[update] should update a gamelist\'s data with given ID and return updated gamelist', async () => {
    const gamelist = await gamelistsService.create({ title: 'My ilst' }, testUser);
    const updatedGamelist = await gamelistsService.update(gamelist.id, {title: 'My list'});
    expect(updatedGamelist.title).toEqual('My list');
  });

  it('[update] should throw a BadRequestException if gamelist\'s id is invalid', async () => {
    const gamelist = await gamelistsService.create({ title: 'My ilst' }, testUser);
    await expect(gamelistsService.update(-10, { title: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if gamelist\'s id doesn\'t exist', async () => {
    await expect(gamelistsService.update(123, { title: '' })).rejects.toThrow(NotFoundException);
  });

  

  it('[remove] should delete a gamelist with given ID and return them', async () => {
    const gamelist = await gamelistsService.create({ title: 'My list' }, testUser);
    const deletedGamelist = await gamelistsService.remove(gamelist.id);
    expect(deletedGamelist).toBeDefined();
  });

  it('[remove] should throw a BadRequestException if gamelist\'s id is invalid', async () => {
    await expect(gamelistsService.remove(undefined)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if gamelist\'s id doesn\'t exist', async () => {
    await expect(gamelistsService.remove(123)).rejects.toThrow(NotFoundException);
  });
});
