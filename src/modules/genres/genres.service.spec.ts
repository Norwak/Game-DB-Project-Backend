import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { Genre } from './entities/genre.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GamesService } from '../games/games.service';

describe('GenresService', () => {
  let genresService: GenresService;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let fakeGamesService: Partial<GamesService>;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    testingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: dataSource.getRepository(Genre),
        },
        {
          provide: GamesService,
          useValue: fakeGamesService,
        },
      ],
    }).compile();

    genresService = testingModule.get<GenresService>(GenresService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(genresService).toBeDefined();
  });
});
