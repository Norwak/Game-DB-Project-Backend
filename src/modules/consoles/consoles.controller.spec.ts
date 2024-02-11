import { Test, TestingModule } from '@nestjs/testing';
import { ConsolesController } from './consoles.controller';
import { UsersService } from '../users/users.service';
import { ConsolesService } from './consoles.service';

describe('ConsolesController', () => {
  let consolesController: ConsolesController;
  let fakeUsersService: Partial<UsersService>;
  let fakeConsolesService: Partial<ConsolesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsolesController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: 'service',
          useValue: fakeConsolesService
        },
      ]
    }).compile();

    consolesController = module.get<ConsolesController>(ConsolesController);
  });

  it('should be defined', () => {
    expect(consolesController).toBeDefined();
  });
});
