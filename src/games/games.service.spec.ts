import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('GamesService', () => {
  let gamesService: GamesService;
  let testingModule: TestingModule;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    testingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: dataSource.getRepository(Game),
        },
      ],
    }).compile();

    gamesService = testingModule.get<GamesService>(GamesService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(gamesService).toBeDefined();
  });



  it('[find] should return an array of games matching search query #1', async () => {
    await gamesService.create({ title: 'Castlevania', releaseDate: new Date('1995-12-17T03:24:00') });

    const games = await gamesService.find('Castlevania');
    expect(games.length).toEqual(1);
    expect(games[0].title).toEqual('Castlevania');
  });

  it('[find] should return an array of games matching search query #2', async () => {
    await gamesService.create({ title: 'Castlevania', releaseDate: new Date('1995-12-17T03:24:00') });
    await gamesService.create({ title: 'Megaman', releaseDate: new Date('1995-12-17T03:24:00') });
    await gamesService.create({ title: 'Mario', releaseDate: new Date('1995-12-17T03:24:00') });

    const games = await gamesService.find('m');
    expect(games.length).toEqual(2);
    expect(games[0].title).toEqual('Megaman');
    expect(games[1].title).toEqual('Mario');
  });

  it('[find] should return an empty array', async () => {
    await gamesService.create({ title: 'Castlevania', releaseDate: new Date('1995-12-17T03:24:00') });
    await gamesService.create({ title: 'Megaman', releaseDate: new Date('1995-12-17T03:24:00') });
    await gamesService.create({ title: 'Mario', releaseDate: new Date('1995-12-17T03:24:00') });

    const games = await gamesService.find('q');
    expect(games.length).toEqual(0);
  });



  it('[findOne] should return a game with given id', async () => {
    const game = await gamesService.create({ title: 'Castlevania', releaseDate: new Date('1995-12-17T03:24:00') });

    const foundGame = await gamesService.findOne(game.id);
    expect(game.title).toEqual('Castlevania');
  });

  it('[findOne] should throw a NotFoundException if game\'s id doesn\'t exist', async () => {
    await expect(gamesService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if game\'s id isn\'t valid', async () => {
    await expect(gamesService.findOne(-15)).rejects.toThrow(BadRequestException);
    await expect(gamesService.findOne(undefined)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create a game with given title and return them', async () => {
    const createdGame = await gamesService.create({ title: 'Castlevania', releaseDate: new Date('1995-12-17T03:24:00') });
    expect(createdGame.title).toEqual('Castlevania');
  });

  it('[create] should throw a BadRequestException if game\'s name is invalid', async () => {
    await expect(gamesService.create({ title: '', releaseDate: new Date('1995-12-17T03:24:00') })).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if game\'s name already exists', async () => {
    await gamesService.create({ title: 'Castlevania', releaseDate: new Date('1995-12-17T03:24:00') });
    await expect(gamesService.create({ title: 'Castlevania', releaseDate: new Date('1995-12-17T03:24:00') })).rejects.toThrow(BadRequestException);
  });



  it('[update] should update a game\'s data with given ID and return updated game', async () => {
    const game = await gamesService.create({ title: 'Konaim', releaseDate: new Date('1995-12-17T03:24:00') });
    const updatedGame = await gamesService.update(game.id, {title: 'Castlevania'});
    expect(updatedGame.title).toEqual('Castlevania');
  });

  it('[update] should throw a BadRequestException if game\'s id is invalid', async () => {
    const game = await gamesService.create({ title: 'Konaim', releaseDate: new Date('1995-12-17T03:24:00') });
    await expect(gamesService.update(-10, { title: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if game\'s id doesn\'t exist', async () => {
    await expect(gamesService.update(123, { title: '' })).rejects.toThrow(NotFoundException);
  });

  

  it('[remove] should delete a game with given ID and return them', async () => {
    const game = await gamesService.create({ title: 'Castlevania', releaseDate: new Date('1995-12-17T03:24:00') });
    const deletedGame = await gamesService.remove(game.id);
    expect(deletedGame).toBeDefined();
  });

  it('[remove] should throw a BadRequestException if game\'s id is invalid', async () => {
    await expect(gamesService.remove(undefined)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if game\'s id doesn\'t exist', async () => {
    await expect(gamesService.remove(123)).rejects.toThrow(NotFoundException);
  });
});
