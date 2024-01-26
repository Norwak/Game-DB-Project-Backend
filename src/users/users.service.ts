import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
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

  async create({ nickname }: CreateUserDto) {
    if (!nickname || nickname === '') {
      throw new BadRequestException('nickname shouldn\'t be empty');
    }

    const users = await this.usersRepository.find({where: {nickname}});
    if (users.length > 0) {
      throw new BadRequestException('user already exists');
    }

    const user = this.usersRepository.create({
      nickname,
      lastLogin: new Date("1970-01-01T00:00:00.000Z")
    });
    return await this.usersRepository.save(user);
  }

  async update(id: number, newData: UpdateUserDto) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const user = await this.usersRepository.findOne({where: {id}});
    if (!user) {
      throw new NotFoundException('user not found with given id');
    }

    Object.assign(user, newData);
    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const user = await this.usersRepository.findOne({where: {id}});
    if (!user) {
      throw new NotFoundException('user not found with given id');
    }

    return await this.usersRepository.remove(user);
  }
}
