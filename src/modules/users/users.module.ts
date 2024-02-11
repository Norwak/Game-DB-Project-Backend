import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { PrivilegesService } from './privileges.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AuthService, PasswordService, PrivilegesService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
