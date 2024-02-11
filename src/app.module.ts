import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import 'dotenv/config'
import { Developer } from './modules/developers/entities/developer.entity';
import { Gamelist } from './modules/gamelists/entities/gamelist.entity';
import { Game } from './modules/games/entities/game.entity';
import { Genre } from './modules/genres/entities/genre.entity';
import { User } from './modules/users/entities/user.entity';
import { DevelopersModule } from './modules/developers/developers.module';
import { GamelistsModule } from './modules/gamelists/gamelists.module';
import { GamesModule } from './modules/games/games.module';
import { GenresModule } from './modules/genres/genres.module';
import { UsersModule } from './modules/users/users.module';
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
    UsersModule
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
    },
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
