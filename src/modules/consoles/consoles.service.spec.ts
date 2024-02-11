import { Test, TestingModule } from '@nestjs/testing';
import { ConsolesService } from './consoles.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { Console } from './entities/console.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ConsolesService', () => {
  let service: ConsolesService;
  let testingModule: TestingModule;
  let dataSource: DataSource;

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
