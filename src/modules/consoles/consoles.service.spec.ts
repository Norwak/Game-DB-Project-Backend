import { Test, TestingModule } from '@nestjs/testing';
import { ConsolesService } from './consoles.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { Console } from './entities/console.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GamesService } from '../games/games.service';

describe('ConsolesService', () => {
  let service: ConsolesService;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let fakeGamesService: Partial<GamesService>;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    testingModule = await Test.createTestingModule({
      providers: [
        ConsolesService,
        {
          provide: getRepositoryToken(Console),
          useValue: dataSource.getRepository(Console),
        },
        {
          provide: GamesService,
          useValue: fakeGamesService,
        },
      ],
    }).compile();

    service = testingModule.get<ConsolesService>(ConsolesService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
