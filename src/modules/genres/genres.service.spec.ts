import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { Genre } from './entities/genre.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GenresService', () => {
  let genresService: GenresService;
  let testingModule: TestingModule;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    const module = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: dataSource.getRepository(Genre),
        },
      ],
    }).compile();

    genresService = module.get<GenresService>(GenresService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(genresService).toBeDefined();
  });
});
