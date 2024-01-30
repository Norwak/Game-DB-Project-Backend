import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        }
      ]
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });



  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });



  it('[find] should return an array with users that match search query', async () => {
    fakeUsersService.find = () => {
      return Promise.resolve([{id: 1, nickname: 'Joel', password: '12345678', lastLogin: new Date('2000-01-01T01:01:01.000Z')} as User]);
    }

    const user = await usersController.find('j');
    expect(user.length).toEqual(1);
    expect(user[0]).toHaveProperty('password');
  });



  it('[findOne] should return the user with given id', async () => {
    fakeUsersService.findOne = () => {
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: '12345678',
        lastLogin: new Date('2000-01-01T01:01:01.000Z'),
        registrationDate: new Date('2000-01-01T01:01:01.000Z')
      } as User);
    }

    const user = await usersController.findOne(1);
    expect(user.nickname).toEqual('Joel');
  });



  it('[create] should return a user back with assigned id', async () => {
    fakeUsersService.create = () => {
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: '12345678',
        lastLogin: new Date('2000-01-01T01:01:01.000Z'),
        registrationDate: new Date('2000-01-01T01:01:01.000Z')
      } as User);
    }

    const user = await usersController.create({nickname: 'Joel', password: '12345678'});
    expect(user).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if nickname isn\'t valid', async () => {
    fakeUsersService.create = () => {
      throw new BadRequestException('nickname shouldn\'t be empty');
    }

    await expect(usersController.create({nickname: '', password: '12345678'})).rejects.toThrow(BadRequestException);
  });



  it('[update] should return a user with updated data', async () => {
    fakeUsersService.update = () => {
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: '12345678',
        lastLogin: new Date('2000-01-01T01:01:01.000Z'),
        registrationDate: new Date('2000-01-01T01:01:01.000Z')
      }as User);
    }

    const updatedUser = await usersController.update(1, {nickname: 'Joel'});
    expect(updatedUser.id).toEqual(1);
    expect(updatedUser.nickname).toEqual('Joel');
  });



  it('[remove] should delete a user by id and return user object back without id', async () => {
    fakeUsersService.remove = () => {
      return Promise.resolve({
        nickname: 'Joel',
        password: '12345678',
        lastLogin: new Date('2000-01-01T01:01:01.000Z'),
        registrationDate: new Date('2000-01-01T01:01:01.000Z')
      } as User);
    }

    const deletedUser = await usersController.remove(1);
    expect(deletedUser.nickname).toEqual('Joel');
    expect(deletedUser).not.toHaveProperty('id');
  });
});
