import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { UsersModule } from '../users/users.module';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Genre]),
    UsersModule,
    GamesModule
  ],
  providers: [
    GenresService,
    {
      provide: 'service',
      useClass: GenresService
    },
  ],
  controllers: [GenresController],
  exports: [GenresService]
})
export class GenresModule {}