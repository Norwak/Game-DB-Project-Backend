import { Test, TestingModule } from '@nestjs/testing';
import { DevelopersService } from './developers.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Developer } from './entities/developer.entity';
import { GamesService } from '../games/games.service';

describe('DevelopersService', () => {
  let developersService: DevelopersService;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let fakeGamesService: Partial<GamesService>;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    testingModule = await Test.createTestingModule({
      providers: [
        DevelopersService,
        {
          provide: getRepositoryToken(Developer),
          useValue: dataSource.getRepository(Developer),
        },
        {
          provide: GamesService,
          useValue: fakeGamesService,
        },
      ],
    }).compile();

    developersService = testingModule.get<DevelopersService>(DevelopersService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(developersService).toBeDefined();
  });
});
