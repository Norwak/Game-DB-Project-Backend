import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesController } from './games/games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games/games.service';
import { DevelopersController } from './developers/developers.controller';
import { GenresController } from './genres/genres.controller';
import { DevelopersService } from './developers/developers.service';
import { GenresService } from './genres/genres.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { GamelistsController } from './gamelists/gamelists.controller';
import { GamelistsService } from './gamelists/gamelists.service';
import { AuthService } from './users/auth.service';
import { User } from './users/entities/user.entity';
import { Game } from './games/entities/game.entity';
import { Developer } from './developers/entities/developer.entity';
import { Genre } from './genres/entities/genre.entity';
import { Gamelist } from './gamelists/entities/gamelist.entity';
import { DevelopersModule } from './developers/developers.module';
import { GamelistsModule } from './gamelists/gamelists.module';
import { GamesModule } from './games/games.module';
import { GenresModule } from './genres/genres.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Developer, Gamelist, Game, Genre, User],
      synchronize: true,
      migrations: [],
      migrationsRun: true,
    }),
    DevelopersModule,
    GamelistsModule,
    GamesModule,
    GenresModule,
    UsersModule,
  ],
  controllers: [AppController, GamesController, DevelopersController, GenresController, UsersController, GamelistsController],
  providers: [AppService, GamesService, DevelopersService, GenresService, UsersService, GamelistsService, AuthService],
})
export class AppModule {}
