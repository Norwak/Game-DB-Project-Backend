import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gamelist } from './entities/gamelist.entity';
import { GamelistsService } from './gamelists.service';
import { GamelistsController } from './gamelists.controller';
import { UsersModule } from '../users/users.module';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gamelist]),
    UsersModule,
    GamesModule
  ],
  providers: [GamelistsService],
  controllers: [GamelistsController],
})
export class GamelistsModule {}
