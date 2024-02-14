import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async find(query: string) {
    const nickname = query || '';
    return await this.usersRepository.find({where: {nickname: Like(`%${nickname}%`)}});
  }

  async findSome(ids: number[]) {
    return await this.usersRepository.find({where: {id: In(ids)}});
  }

  async findOne(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const user = await this.usersRepository.findOne({where: {id}});
    if (!user) {
      throw new NotFoundException('user not found with given id');
    }

    return user;
  }

  async create({ nickname, password }: CreateUserDto) {
    if (!nickname || nickname === '') {
      throw new BadRequestException('nickname shouldn\'t be empty');
    }

    const users = await this.usersRepository.find({where: {nickname}});
    if (users.length > 0) {
      throw new BadRequestException('user already exists');
    }

    const user = this.usersRepository.create({
      nickname,
      password,
      lastLogin: new Date("1970-01-01T00:00:00.000Z")
    });
    return await this.usersRepository.save(user);
  }

  async update(id: number, newData: UpdateUserDto, session: Record<string, any>) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const targetUser = await this.findOne(id);
    const currentUser = await this.findOne(session.userId);

    if (!currentUser.isAdmin && currentUser.id !== targetUser.id) {
      throw new ForbiddenException();
    }

    Object.assign(targetUser, newData);
    return await this.usersRepository.save(targetUser);
  }

  async updateAdmin(id: number, value: boolean) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const user = await this.findOne(id);

    Object.assign(user, {isAdmin: value});
    return await this.usersRepository.save(user);
  }

  async remove(id: number, session: Record<string, any>) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const targetUser = await this.findOne(id);
    const currentUser = await this.findOne(session.userId);

    // clear session if deleting self
    if (targetUser.id === currentUser.id) {
      delete session.userId;
    }

    // allow if admin or yourself
    if (currentUser.isAdmin || targetUser.id === currentUser.id) {
      return await this.usersRepository.remove(targetUser);
    } else {
      throw new ForbiddenException();
    }
  }
}
