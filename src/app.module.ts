import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { APP_PIPE } from '@nestjs/core';
import 'dotenv/config'
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DEV_DB_NAME,
      entities: [Developer, Gamelist, Game, Genre, User],
      synchronize: true,
      migrations: [],
      migrationsRun: (process.env.DEV_MIGRATIONS_RUN === 'true'),
    }),
    DevelopersModule,
    GamelistsModule,
    GamesModule,
    GenresModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        }
      }),
    }
  ],
})
export class AppModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: [process.env.DEV_COOKIE_KEY],
    })).forRoutes('*');
  }
}
