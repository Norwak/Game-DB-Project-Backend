import { Test, TestingModule } from '@nestjs/testing';
import { DevelopersController } from './developers.controller';
import { UsersService } from '../users/users.service';
import { DevelopersService } from './developers.service';

describe('DevelopersController', () => {
  let developersController: DevelopersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeDevelopersService: Partial<DevelopersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevelopersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: 'service',
          useValue: fakeDevelopersService
        },
      ]
    }).compile();

    developersController = module.get<DevelopersController>(DevelopersController);
  });

  it('should be defined', () => {
    expect(developersController).toBeDefined();
  });
});