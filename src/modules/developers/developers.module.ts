import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Developer } from './entities/developer.entity';
import { DevelopersService } from './developers.service';
import { DevelopersController } from './developers.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Developer]),
    UsersModule
  ],
  providers: [
    DevelopersService,
    {
      provide: 'service',
      useClass: DevelopersService
    },
  ],
  controllers: [DevelopersController],
  exports: [DevelopersService]
})
export class DevelopersModule {}
