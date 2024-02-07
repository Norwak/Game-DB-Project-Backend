import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GenresModule } from '../genres/genres.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    GenresModule
  ],
  providers: [GamesService],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
