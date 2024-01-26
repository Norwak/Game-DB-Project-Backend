import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let testingModule: TestingModule;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    testingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: dataSource.getRepository(User),
        },
      ],
    }).compile();

    usersService = testingModule.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });



  it('[find] should return an array of users matching search query #1', async () => {
    await usersService.create({ nickname: 'Joel' });

    const users = await usersService.find('Joel');
    expect(users.length).toEqual(1);
    expect(users[0].nickname).toEqual('Joel');
    expect(users[0].lastLogin.getFullYear()).toEqual(1970);
  });

  it('[find] should return an array of users matching search query #2', async () => {
    await usersService.create({ nickname: 'Joel' });
    await usersService.create({ nickname: 'Simon' });
    await usersService.create({ nickname: 'Samus' });

    const users = await usersService.find('m');
    expect(users.length).toEqual(2);
    expect(users[0].nickname).toEqual('Simon');
    expect(users[1].nickname).toEqual('Samus');
  });

  it('[find] should return an empty array', async () => {
    await usersService.create({ nickname: 'Joel' });
    await usersService.create({ nickname: 'Simon' });
    await usersService.create({ nickname: 'Samus' });

    const users = await usersService.find('q');
    expect(users.length).toEqual(0);
  });



  it('[findOne] should return a user with given id', async () => {
    const user = await usersService.create({ nickname: 'Joel' });

    const foundUser = await usersService.findOne(user.id);
    expect(user.nickname).toEqual('Joel');
  });

  it('[findOne] should throw a NotFoundException if user\'s id doesn\'t exist', async () => {
    await expect(usersService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if user\'s id isn\'t valid', async () => {
    await expect(usersService.findOne(-15)).rejects.toThrow(BadRequestException);
    await expect(usersService.findOne(undefined)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create a user with given nickname and return them with registration date and last login in 1970', async () => {
    const createdUser = await usersService.create({ nickname: 'Joel' });
    expect(createdUser.nickname).toEqual('Joel');
    expect(createdUser.registrationDate).toBeDefined();
    expect(createdUser.lastLogin).toBeDefined();
  });

  it('[create] should throw a BadRequestException if user\'s name is invalid', async () => {
    await expect(usersService.create({ nickname: '' })).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if user\'s name already exists', async () => {
    await usersService.create({ nickname: 'Joel' });
    await expect(usersService.create({ nickname: 'Joel' })).rejects.toThrow(BadRequestException);
  });



  it('[update] should update a user\'s data with given ID and return updated user', async () => {
    const user = await usersService.create({ nickname: 'Jole' });
    const updatedUser = await usersService.update(user.id, {nickname: 'Joel'});
    expect(updatedUser.nickname).toEqual('Joel');
  });

  it('[update] should throw a BadRequestException if user\'s id is invalid', async () => {
    const user = await usersService.create({ nickname: 'Jole' });
    await expect(usersService.update(-10, { nickname: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if user\'s id doesn\'t exist', async () => {
    await expect(usersService.update(123, { nickname: '' })).rejects.toThrow(NotFoundException);
  });

  

  it('[remove] should delete a user with given ID and return them', async () => {
    const user = await usersService.create({ nickname: 'Joel' });
    const deletedUser = await usersService.remove(user.id);
    expect(deletedUser).toBeDefined();
  });

  it('[remove] should throw a BadRequestException if user\'s id is invalid', async () => {
    await expect(usersService.remove(undefined)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if user\'s id doesn\'t exist', async () => {
    await expect(usersService.remove(123)).rejects.toThrow(NotFoundException);
  });
});
