import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gamelist } from './entities/gamelist.entity';
import { GamelistsService } from './gamelists.service';
import { GamelistsController } from './gamelists.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gamelist]),
    UsersModule
  ],
  providers: [GamelistsService],
  controllers: [GamelistsController],
})
export class GamelistsModule {}
