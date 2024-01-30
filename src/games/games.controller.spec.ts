import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dtos/create-game.dto';
import { BadRequestException } from '@nestjs/common';

describe('GamesController', () => {
  let gamesController: GamesController;
  let fakeGamesService: Partial<GamesService>;

  beforeEach(async () => {
    fakeGamesService = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: fakeGamesService,
        }
      ]
    }).compile();

    gamesController = module.get<GamesController>(GamesController);
  });



  it('should be defined', () => {
    expect(gamesController).toBeDefined();
  });



  it('[find] should return an array with games that match search query', async () => {
    fakeGamesService.find = () => {
      return Promise.resolve([{id: 1, title: 'Castlevania', releaseDate: new Date('1995-12-01T05:05:05.000Z')} as Game]);
    }

    const game = await gamesController.find('Castle');
    expect(game.length).toEqual(1);
    expect(game[0].title).toEqual('Castlevania');
  });



  it('[findOne] should return the game with given id', async () => {
    fakeGamesService.findOne = () => {
      return Promise.resolve({id: 1, title: 'Castlevania', releaseDate: new Date('1995-12-01T05:05:05.000Z')} as Game);
    }

    const game = await gamesController.findOne(1);
    expect(game.title).toEqual('Castlevania');
  });



  it('[create] should return a game back with assigned id', async () => {
    fakeGamesService.create = () => {
      return Promise.resolve({id: 1, title: 'Castlevania', releaseDate: new Date('1995-12-01T05:05:05.000Z')} as Game);
    }

    const game = await gamesController.create({title: 'Castle', releaseDate: new Date('1995-12-01T05:05:05.000Z')});
    expect(game).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if title isn\'t valid', async () => {
    fakeGamesService.create = () => {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    await expect(gamesController.create({title: undefined, releaseDate: new Date('1995-12-01T05:05:05.000Z')})).rejects.toThrow(BadRequestException);
  });



  it('[update] should return a game with updated data', async () => {
    fakeGamesService.update = () => {
      return Promise.resolve({id: 1, title: 'Castlevania', releaseDate: new Date('1995-12-01T05:05:05.000Z')} as Game);
    }

    const updatedGame = await gamesController.update(1, {title: 'Castlevania'});
    expect(updatedGame.id).toEqual(1);
    expect(updatedGame.title).toEqual('Castlevania');
  });



  it('[remove] should delete a develper by id and return game object back without id', async () => {
    fakeGamesService.remove = () => {
      return Promise.resolve({title: 'Castlevania', releaseDate: new Date('1995-12-01T05:05:05.000Z')} as Game);
    }

    const deletedGame = await gamesController.remove(1);
    expect(deletedGame).toHaveProperty('title');
    expect(deletedGame).toHaveProperty('releaseDate');
    expect(deletedGame).not.toHaveProperty('id');
  });
});
