import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './genres.controller';
import { UsersService } from '../users/users.service';
import { GenresService } from './genres.service';

describe('GenresController', () => {
  let genresController: GenresController;
  let fakeUsersService: Partial<UsersService>;
  let fakeGenresService: Partial<GenresService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: 'service',
          useValue: fakeGenresService
        },
      ]
    }).compile();

    genresController = module.get<GenresController>(GenresController);
  });

  it('should be defined', () => {
    expect(genresController).toBeDefined();
  });
});
