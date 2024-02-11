import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './genres.controller';

describe('GenresController', () => {
  let genresController: GenresController;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
    }).compile();

    genresController = module.get<GenresController>(GenresController);
  });

  it('should be defined', () => {
    expect(genresController).toBeDefined();
  });
});
