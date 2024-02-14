import { Test, TestingModule } from '@nestjs/testing';
import { GamelistsService } from './gamelists.service';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gamelist } from './entities/gamelist.entity';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Game } from '../games/entities/game.entity';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';

describe('GamelistsService', () => {
  let gamelistsService: GamelistsService;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let fakeGamesService: Partial<GamesService>;
  let fakeUsersService: Partial<UsersService>;
  let testUser = {
    id: 1,
    nickname: 'Joel',
    password: '12345678',
    registrationDate: new Date('2020-02-02T02:02:02.000Z'),
    lastLogin: new Date('2020-02-02T02:02:02.000Z'),
    isAdmin: false,
  } as User;
  let adminUser = {
    id: 2,
    nickname: 'Smith',
    password: '12345678',
    registrationDate: new Date('2020-02-02T02:02:02.000Z'),
    lastLogin: new Date('2020-02-02T02:02:02.000Z'),
    isAdmin: true,
  } as User;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    await dataSource.createQueryBuilder().insert().into(User).values([
      testUser, adminUser
    ]).execute();

    fakeGamesService = {
      findSome: async (id: number[]) => {
        return await dataSource.createQueryBuilder().select("game").from(Game, "game")
          .where("game.id IN (:...id)", {id})
          .getMany();
      },
    }
    
    fakeUsersService = {
      findOne: async (id: number) => {
        return await dataSource.createQueryBuilder().select("user").from(User, "user")
        .where("user.id = :id", {id})
        .getOne();
      }
    }

    testingModule = await Test.createTestingModule({
      providers: [
        GamelistsService,
        {
          provide: getRepositoryToken(Gamelist),
          useValue: dataSource.getRepository(Gamelist),
        },
        {
          provide: getRepositoryToken(User),
          useValue: dataSource.getRepository(User),
        },
        {
          provide: GamesService,
          useValue: fakeGamesService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
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
    const session = {userId: testUser.id};
    await gamelistsService.create({ title: 'My list' }, session);

    const gamelists = await gamelistsService.find('My list');
    expect(gamelists.length).toEqual(1);
    expect(gamelists[0].title).toEqual('My list');
  });

  it('[find] should return an array of gamelists matching search query #2', async () => {
    const session = {userId: testUser.id};
    await gamelistsService.create({ title: 'My list' }, session);
    await gamelistsService.create({ title: 'Best games' }, session);
    await gamelistsService.create({ title: 'Backlog' }, session);

    const gamelists = await gamelistsService.find('m');
    expect(gamelists.length).toEqual(2);
    expect(gamelists[0].title).toEqual('My list');
    expect(gamelists[1].title).toEqual('Best games');
  });

  it('[find] should return an empty array', async () => {
    const session = {userId: testUser.id};
    await gamelistsService.create({ title: 'My list' }, session);
    await gamelistsService.create({ title: 'Best games' }, session);
    await gamelistsService.create({ title: 'Backlog' }, session);

    const gamelists = await gamelistsService.find('q');
    expect(gamelists.length).toEqual(0);
  });



  it('[findSome] should return an array of gamelists by ids', async () => {
    const session = {userId: testUser.id};
    await gamelistsService.create({ title: 'List #1' }, session);
    await gamelistsService.create({ title: 'List #2' }, session);
    await gamelistsService.create({ title: 'List #3' }, session);

    const gamelists = await gamelistsService.findSome([1, 2, 3]);
    expect(gamelists.length).toEqual(3);
    expect(gamelists[2].title).toEqual('List #3');
  });

  it('[findSome] should return an empty array of gamelists weren\'t found', async () => {
    const gamelists = await gamelistsService.findSome([1, 2, 3]);
    expect(gamelists.length).toEqual(0);
  });



  it('[findOne] should return a gamelist with given id', async () => {
    const session = {userId: testUser.id};
    const gamelist = await gamelistsService.create({ title: 'My list' }, session);

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



  it('[userGamelists] should return array of gamelists owned by user with given ID', async () => {
    await dataSource.createQueryBuilder().insert().into(Game).values([
      {title: 'Castlevania', releaseDate: new Date('1995-12-17T03:24:00.000Z')},
      {title: 'Mario', releaseDate: new Date('1995-12-17T03:24:00.000Z')},
      {title: 'Battletoads', releaseDate: new Date('1995-12-17T03:24:00.000Z')},
      {title: 'Megaman', releaseDate: new Date('1995-12-17T03:24:00.000Z')},
      {title: 'Kirby', releaseDate: new Date('1995-12-17T03:24:00.000Z')},
    ]).execute();

    let session = {userId: testUser.id};
    const createdGamelist = await gamelistsService.create({ title: 'My list' }, session);

    session = {userId: testUser.id}
    const addGamesDto = {
      gamelistId: createdGamelist.id,
      gameIds: [1, 2, 3, 4, 5]
    }
    await gamelistsService.addGames(addGamesDto, session);

    const userId = 1;
    const foundGamelists = await gamelistsService.userGamelists(userId);
    expect(foundGamelists.length).toEqual(1);
    expect(foundGamelists[0].games.length).toEqual(5);
    expect(foundGamelists[0].games[0].title).toEqual('Kirby');
    expect(foundGamelists[0].games[3].title).toEqual('Mario');
  });

  it('[userGamelists] should return an empty array if user doesn\'t have gamelists', async () => {
    // user ID is 1
    let session = {userId: testUser.id};
    await gamelistsService.create({ title: 'My list' }, session);

    const userId = 2;
    const foundGamelists = await gamelistsService.userGamelists(userId);
    expect(foundGamelists).toEqual([]);
  });



  it('[gameGamelists] should return array of gamelists that have a game with given ID', async () => {
    await dataSource.createQueryBuilder().insert().into(Game).values([
      {title: 'Castlevania', releaseDate: new Date('1995-12-17T03:24:00.000Z')},
      {title: 'Mario', releaseDate: new Date('1995-12-17T03:24:00.000Z')},
      {title: 'Battletoads', releaseDate: new Date('1995-12-17T03:24:00.000Z')},
      {title: 'Megaman', releaseDate: new Date('1995-12-17T03:24:00.000Z')},
      {title: 'Kirby', releaseDate: new Date('1995-12-17T03:24:00.000Z')},
    ]).execute();

    let session = {userId: testUser.id};
    const createdGamelist = await gamelistsService.create({ title: 'My list' }, session);

    session = {userId: testUser.id};
    const addGamesDto = {
      gamelistId: createdGamelist.id,
      gameIds: [1, 2, 3, 4, 5]
    }
    await gamelistsService.addGames(addGamesDto, session);

    const gameId = 1;
    const foundGamelists = await gamelistsService.gameGamelists(gameId);
    expect(foundGamelists.length).toEqual(1);
    expect(foundGamelists[0].games.length).toEqual(5);
    expect(foundGamelists[0].games[0].title).toEqual('Kirby');
    expect(foundGamelists[0].games[3].title).toEqual('Mario');
  });

  it('[gameGamelists] should return an empty array if game isn\'t in any gamelists', async () => {
    let session = {userId: testUser.id};
    await gamelistsService.create({ title: 'My list' }, session);

    const gameId = 1;
    const foundGamelists = await gamelistsService.gameGamelists(gameId);
    expect(foundGamelists).toEqual([]);
  });



  it('[create] should create a gamelist with given title and return them', async () => {
    let session = {userId: testUser.id};
    const createdGamelist = await gamelistsService.create({ title: 'My list' }, session);
    expect(createdGamelist.title).toEqual('My list');
    expect(createdGamelist.creationDate.getFullYear()).toEqual(new Date().getFullYear());
    expect(createdGamelist.lastUpdated.getFullYear()).toEqual(new Date().getFullYear());
    expect(createdGamelist.user.id).toEqual(1);
  });

  it('[create] should throw a BadRequestException if gamelist\'s name is invalid', async () => {
    await expect(gamelistsService.create({ title: '' }, testUser)).rejects.toThrow(BadRequestException);
  });



  it('[update] should update a gamelist\'s data with given ID and return updated gamelist', async () => {
    let session = {userId: testUser.id};
    const gamelist = await gamelistsService.create({ title: 'My ilst' }, session);
    session = {userId: testUser.id};
    const updatedGamelist = await gamelistsService.update(gamelist.id, {title: 'My list'}, session);
    expect(updatedGamelist.title).toEqual('My list');
  });

  it('[update] should throw a BadRequestException if gamelist\'s id is invalid', async () => {
    const session: Record<string, any> = {userId: testUser.id};
    await expect(gamelistsService.update(-10, { title: '' }, session)).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if gamelist\'s id doesn\'t exist', async () => {
    const session: Record<string, any> = {userId: testUser.id};
    await expect(gamelistsService.update(123, { title: '' }, session)).rejects.toThrow(NotFoundException);
  });

  it('[update] should work only of user is updating own gamelist or is admin', async () => {
    let session = {userId: testUser.id};
    const gamelist = await gamelistsService.create({ title: 'My ilst' }, session);

    // admin updates common user's gamelist
    session = {userId: adminUser.id};
    let updatedGamelist = await gamelistsService.update(gamelist.id, {title: 'My List'}, session);
    expect(updatedGamelist.title).toEqual('My List');

    // user updates own gamelist
    session = {userId: testUser.id};
    updatedGamelist = await gamelistsService.update(gamelist.id, {title: 'Best list ever'}, session);
    expect(updatedGamelist.title).toEqual('Best list ever');

    // user tries to update admin's gamelist
    session = {userId: adminUser.id};
    const adminGamelist = await gamelistsService.create({ title: 'My ilst' }, session);
    session = {userId: testUser.id};
    await expect(gamelistsService.update(adminGamelist.id, {title: 'Malicious title'}, session)).rejects.toThrow(ForbiddenException);
  });


  

  it('[remove] should delete a gamelist with given ID and return them', async () => {
    let session = {userId: testUser.id};
    const gamelist = await gamelistsService.create({ title: 'My list' }, session);
    const deletedGamelist = await gamelistsService.remove(gamelist.id, session);
    expect(deletedGamelist).toBeDefined();
  });

  it('[remove] should throw a BadRequestException if gamelist\'s id is invalid', async () => {
    const session: Record<string, any> = {userId: testUser.id};
    await expect(gamelistsService.remove(undefined, session)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if gamelist\'s id doesn\'t exist', async () => {
    const session: Record<string, any> = {userId: testUser.id};
    await expect(gamelistsService.remove(123, session)).rejects.toThrow(NotFoundException);
  });

  it('[remove] should work only of user is removing own gamelist or is admin', async () => {
    // admin deletes common user's gamelist
    let session = {userId: testUser.id};
    let gamelist = await gamelistsService.create({ title: 'My list' }, session);
    session = {userId: adminUser.id};
    let updatedGamelist = await gamelistsService.remove(gamelist.id, session);
    expect(updatedGamelist.id).toEqual(undefined);

    // user deletes own gamelist
    session = {userId: testUser.id};
    gamelist = await gamelistsService.create({ title: 'My list' }, session);
    session = {userId: testUser.id};
    updatedGamelist = await gamelistsService.update(gamelist.id, {title: 'Best list ever'}, session);
    expect(updatedGamelist.title).toEqual('Best list ever');

    // user tries to delete admin's gamelist
    session = {userId: adminUser.id};
    gamelist = await gamelistsService.create({ title: 'My list' }, session);
    session = {userId: testUser.id};
    await expect(gamelistsService.update(gamelist.id, {title: 'Malicious title'}, session)).rejects.toThrow(ForbiddenException);
  });
  


  it('[addGames] should add games to playlist and return playlist with games', async () => {
    let session = {userId: testUser.id};
    const gamelist = await gamelistsService.create({ title: 'My ilst' }, session);
    await dataSource.createQueryBuilder().insert().into(Game).values([
      {title: 'Zelda', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Mario', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
    ]).execute();

    const addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2]};
    session = {userId: testUser.id}
    const updatedGamelist = await gamelistsService.addGames(addGamesDto, session);
    expect(updatedGamelist.games.length).toEqual(2);
    expect(updatedGamelist.games[0].id).toEqual(1);
  });

  it('[addGames] should append games, not overwhite the whole list', async () => {
    let session = {userId: testUser.id};
    const gamelist = await gamelistsService.create({ title: 'My ilst' }, session);
    await dataSource.createQueryBuilder().insert().into(Game).values([
      {title: 'Zelda', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Mario', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Castlevania', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Final Fantasy I', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
    ]).execute();

    let addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2]};
    session = {userId: testUser.id}
    let updatedGamelist = await gamelistsService.addGames(addGamesDto, session);

    addGamesDto = {gamelistId: gamelist.id, gameIds: [3, 4]};
    updatedGamelist = await gamelistsService.addGames(addGamesDto, session);

    expect(updatedGamelist.games.length).toEqual(4);
    expect(updatedGamelist.games[2].id).toEqual(3);
  });

  it('[addGames] should should\'t add duplicate games', async () => {
    let session = {userId: testUser.id};
    const gamelist = await gamelistsService.create({ title: 'My ilst' }, session);
    await dataSource.createQueryBuilder().insert().into(Game).values([
      {title: 'Zelda', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Mario', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Castlevania', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
    ]).execute();

    let addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2]};
    session = {userId: testUser.id}
    let updatedGamelist = await gamelistsService.addGames(addGamesDto, session);

    addGamesDto = {gamelistId: gamelist.id, gameIds: [2, 3]};
    updatedGamelist = await gamelistsService.addGames(addGamesDto, session);

    expect(updatedGamelist.games.length).toEqual(3);
    expect(updatedGamelist.games[2].id).toEqual(3);
  });

  it('[addGames] should work only of user is removing own gamelist or is admin', async () => {
    await dataSource.createQueryBuilder().insert().into(Game).values([
      {title: 'Zelda', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Mario', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Castlevania', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
    ]).execute();

    // admin adds games to common user's gamelist
    let session = {userId: testUser.id};
    let gamelist = await gamelistsService.create({ title: 'My list' }, session);
    let addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2]};
    session = {userId: adminUser.id};
    let updatedGamelist = await gamelistsService.addGames(addGamesDto, session);
    expect(updatedGamelist.games[1].title).toEqual('Mario');

    // user adds games to own gamelist
    session = {userId: testUser.id};
    gamelist = await gamelistsService.create({ title: 'My list' }, session);
    addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2]};
    session = {userId: testUser.id};
    updatedGamelist = await gamelistsService.addGames(addGamesDto, session);
    expect(updatedGamelist.games[1].title).toEqual('Mario');

    // user tries to add game to admin's gamelist
    session = {userId: adminUser.id};
    gamelist = await gamelistsService.create({ title: 'My list' }, session);
    addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2]};
    session = {userId: testUser.id};
    await expect(gamelistsService.addGames(addGamesDto, session)).rejects.toThrow(ForbiddenException);
  });



  it('[removeGames] should remove games from playlist and return playlist with result', async () => {
    let session = {userId: testUser.id};
    const gamelist = await gamelistsService.create({ title: 'My list' }, session);
    await dataSource.createQueryBuilder().insert().into(Game).values([
      {title: 'Zelda', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Mario', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
    ]).execute();

    let addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2]};
    session = {userId: adminUser.id};
    let updatedGamelist = await gamelistsService.addGames(addGamesDto, session);

    let removeGamesDto = {gamelistId: gamelist.id, gameIds: [1]};
    updatedGamelist = await gamelistsService.removeGames(removeGamesDto, session);
    expect(updatedGamelist.games.length).toEqual(1);
    expect(updatedGamelist.games[0].title).toEqual('Mario');

    removeGamesDto = {gamelistId: gamelist.id, gameIds: [2]};
    updatedGamelist = await gamelistsService.removeGames(removeGamesDto, session);
    expect(updatedGamelist.games.length).toEqual(0);
  });

  it('[removeGames] should ignore games that already aren\'t in the gamelist', async () => {
    let session = {userId: testUser.id};
    const gamelist = await gamelistsService.create({ title: 'My ilst' }, session);
    await dataSource.createQueryBuilder().insert().into(Game).values([
      {title: 'Zelda', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Mario', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Castlevania', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
    ]).execute();

    let addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2, 3]};
    session = {userId: adminUser.id};
    let updatedGamelist = await gamelistsService.addGames(addGamesDto, session);

    let removeGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2, 4, 5, 99, 1023]};
    updatedGamelist = await gamelistsService.removeGames(removeGamesDto, session);
    expect(updatedGamelist.games.length).toEqual(1);
    expect(updatedGamelist.games[0].title).toEqual('Castlevania');
  });

  it('[removeGames] should work only of user is removing own gamelist or is admin', async () => {
    await dataSource.createQueryBuilder().insert().into(Game).values([
      {title: 'Zelda', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Mario', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
      {title: 'Castlevania', releaseDate: new Date('2020-02-20T12:12:12.000Z')} as Game,
    ]).execute();

    // admin removes games from common user's gamelist
    let session = {userId: testUser.id};
    let gamelist = await gamelistsService.create({ title: 'My list' }, session);
    let addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2]};
    session = {userId: adminUser.id};
    let updatedGamelist = await gamelistsService.addGames(addGamesDto, session);

    let removeGamesDto = {gamelistId: gamelist.id, gameIds: [1]};
    updatedGamelist = await gamelistsService.removeGames(removeGamesDto, session);
    expect(updatedGamelist.games[0].title).toEqual('Mario');

    // user removes games from own gamelist
    session = {userId: testUser.id};
    gamelist = await gamelistsService.create({ title: 'My list' }, session);
    addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2]};
    session = {userId: testUser.id};
    updatedGamelist = await gamelistsService.addGames(addGamesDto, session);

    removeGamesDto = {gamelistId: gamelist.id, gameIds: [1]};
    updatedGamelist = await gamelistsService.removeGames(removeGamesDto, session);
    expect(updatedGamelist.games[0].title).toEqual('Mario');

    // user tries to remove game from admin's gamelist
    session = {userId: adminUser.id};
    gamelist = await gamelistsService.create({ title: 'My list' }, session);
    addGamesDto = {gamelistId: gamelist.id, gameIds: [1, 2]};
    updatedGamelist = await gamelistsService.addGames(addGamesDto, session);

    removeGamesDto = {gamelistId: gamelist.id, gameIds: [1]};
    session = {userId: testUser.id};
    await expect(gamelistsService.removeGames(removeGamesDto, session)).rejects.toThrow(ForbiddenException);
  });
});
