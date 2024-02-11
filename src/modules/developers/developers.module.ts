import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Developer } from './entities/developer.entity';
import { DevelopersService } from './developers.service';
import { DevelopersController } from './developers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Developer])],
  providers: [DevelopersService],
  controllers: [DevelopersController],
})
export class DevelopersModule {}
