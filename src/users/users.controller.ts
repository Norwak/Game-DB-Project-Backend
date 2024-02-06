import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { PrivilegesService } from './privileges.service';
import { setAdminDto } from './dtos/set-admin.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private privilegesService: PrivilegesService
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.usersService.find(query);
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  async whoami(@Session() session: Record<string, any>) {
    return await this.usersService.findOne(session.userId);
  }

  @Get('signout')
  signout(@Session() session: Record<string, any>) {
    return this.authService.signout(session);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne(id);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Post('signin')
  async signin(@Body() createUserDto: CreateUserDto, @Session() session: Record<string, any>) {
    return await this.authService.signin(createUserDto, session);
  }

  @Post('setadmin')
  async setAdmin(@Body() {userId, adminKey, value}: setAdminDto) {
    return await this.privilegesService.setAdmin(userId, adminKey, value);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Session() session: Record<string, any>) {
    return await this.usersService.update(id, updateUserDto, session);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number, @Session() session: Record<string, any>) {
    return await this.usersService.remove(id, session);
  }
}
