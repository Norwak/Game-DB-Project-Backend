import { Test, TestingModule } from '@nestjs/testing';
import { GamelistsService } from './gamelists.service';

describe('GamelistsService', () => {
  let service: GamelistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamelistsService],
    }).compile();

    service = module.get<GamelistsService>(GamelistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
