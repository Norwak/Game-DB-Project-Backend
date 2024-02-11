import { Test } from '@nestjs/testing';
import { GenresService } from './genres.service';

describe('GenresService', () => {
  let genresService: GenresService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GenresService],
    }).compile();

    genresService = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(genresService).toBeDefined();
  });
});
