import { Test, TestingModule } from '@nestjs/testing';
import { DevelopersService } from './developers.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Developer } from './entities/developer.entity';

describe('DevelopersService', () => {
  let developersService: DevelopersService;
  let testingModule: TestingModule;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    const module = await Test.createTestingModule({
      providers: [
        DevelopersService,
        {
          provide: getRepositoryToken(Developer),
          useValue: dataSource.getRepository(Developer),
        },
      ],
    }).compile();

    developersService = module.get<DevelopersService>(DevelopersService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(developersService).toBeDefined();
  });
});
