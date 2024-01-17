import { Test, TestingModule } from '@nestjs/testing';
import { GamelistsController } from './gamelists.controller';

describe('GamelistsController', () => {
  let controller: GamelistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamelistsController],
    }).compile();

    controller = module.get<GamelistsController>(GamelistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
