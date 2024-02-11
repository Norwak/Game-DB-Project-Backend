import { Module } from '@nestjs/common';
import { ConsolesService } from './consoles.service';
import { ConsolesController } from './consoles.controller';
import { Console } from './entities/console.entity';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Console]),
    UsersModule
  ],
  providers: [
    ConsolesService,
    {
      provide: 'service',
      useClass: ConsolesService
    },
  ],
  controllers: [ConsolesController],
  exports: [ConsolesService]
})
export class ConsolesModule {}
