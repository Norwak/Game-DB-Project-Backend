import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'sqlite',
          database: configService.get<string>('DB_NAME'),
          entities: [Developer, Gamelist, Game, Genre, User],
          synchronize: true,
          migrations: [],
          migrationsRun: configService.get<boolean>('MIGRATIONS_RUN'),
        }
      }
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
  constructor(
    private configService: ConfigService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: [this.configService.get('COOKIE_KEY')],
    })).forRoutes('*');
  }
}
