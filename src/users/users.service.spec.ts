import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

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
    await usersService.create({ nickname: 'Joel', password: '12345678' });

    const users = await usersService.find('Joel');
    expect(users.length).toEqual(1);
    expect(users[0].nickname).toEqual('Joel');
    expect(users[0].lastLogin.getFullYear()).toEqual(1970);
    expect(users[0]).toHaveProperty('password');
  });

  it('[find] should return an array of users matching search query #2', async () => {
    await usersService.create({ nickname: 'Joel', password: '12345678' });
    await usersService.create({ nickname: 'Simon', password: '12345678' });
    await usersService.create({ nickname: 'Samus', password: '12345678' });

    const users = await usersService.find('m');
    expect(users.length).toEqual(2);
    expect(users[0].nickname).toEqual('Simon');
    expect(users[1].nickname).toEqual('Samus');
  });

  it('[find] should return an empty array', async () => {
    await usersService.create({ nickname: 'Joel', password: '12345678' });
    await usersService.create({ nickname: 'Simon', password: '12345678' });
    await usersService.create({ nickname: 'Samus', password: '12345678' });

    const users = await usersService.find('q');
    expect(users.length).toEqual(0);
  });



  it('[findSome] should return an array of users by ids', async () => {
    await usersService.create({ nickname: 'Joel', password: '12345678' });
    await usersService.create({ nickname: 'Simon', password: '12345678' });
    await usersService.create({ nickname: 'Samus', password: '12345678' });

    const users = await usersService.findSome([1, 2, 3]);
    expect(users.length).toEqual(3);
    expect(users[2].nickname).toEqual('Samus');
  });

  it('[findSome] should return an empty array of users weren\'t found', async () => {
    const users = await usersService.findSome([1, 2, 3]);
    expect(users.length).toEqual(0);
  });



  it('[findOne] should return a user with given id', async () => {
    const user = await usersService.create({ nickname: 'Joel', password: '12345678' });

    const foundUser = await usersService.findOne(user.id);
    expect(foundUser.nickname).toEqual('Joel');
    expect(foundUser).toHaveProperty('password');
  });

  it('[findOne] should throw a NotFoundException if user\'s id doesn\'t exist', async () => {
    await expect(usersService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if user\'s id isn\'t valid', async () => {
    await expect(usersService.findOne(-15)).rejects.toThrow(BadRequestException);
    await expect(usersService.findOne(undefined)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create a user with given nickname and return them with registration date and last login in 1970', async () => {
    const createdUser = await usersService.create({ nickname: 'Joel', password: '12345678' });
    expect(createdUser.nickname).toEqual('Joel');
    expect(createdUser).toHaveProperty('registrationDate');
    expect(createdUser).toHaveProperty('lastLogin');
    expect(createdUser).toHaveProperty('password');
  });

  it('[create] should throw a BadRequestException if user\'s name is invalid', async () => {
    await expect(usersService.create({ nickname: '', password: '12345678' })).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if user\'s name already exists', async () => {
    await usersService.create({ nickname: 'Joel', password: '12345678' });
    await expect(usersService.create({ nickname: 'Joel', password: '12345678' })).rejects.toThrow(BadRequestException);
  });



  it('[update] should update a user\'s data with given ID and return updated user', async () => {
    const user = await usersService.create({ nickname: 'Jole', password: '12345678' });
    const session: Record<string, any> = {userId: user.id};
    const updatedUser = await usersService.update(user.id, {nickname: 'Joel'}, session);
    expect(updatedUser.nickname).toEqual('Joel');
    expect(updatedUser).toHaveProperty('password');
  });

  it('[update] should throw a BadRequestException if user\'s id is invalid', async () => {
    const user = await usersService.create({ nickname: 'Jole', password: '12345678' });
    const session: Record<string, any> = {userId: user.id};
    await expect(usersService.update(-10, { nickname: '' }, session)).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if user\'s id doesn\'t exist', async () => {
    await expect(usersService.update(123, { nickname: '' }, {})).rejects.toThrow(NotFoundException);
  });

  it('[update] should work only of user is updating self or admin', async () => {
    const adminUser = await usersService.create({ nickname: 'Admin', password: '12345678' });
    await usersService.updateAdmin(adminUser.id, true);

    const commonUser = await usersService.create({ nickname: 'Jole', password: '12345678' });

    // admin updates common user
    let session: Record<string, any> = {userId: adminUser.id};
    let updatedUser = await usersService.update(commonUser.id, {nickname: 'Oleg'}, session);
    expect(updatedUser.nickname).toEqual('Oleg');

    // user updates self
    session = {userId: commonUser.id};
    updatedUser = await usersService.update(commonUser.id, {nickname: 'Joel'}, session);
    expect(updatedUser.nickname).toEqual('Joel');

    // user tries to update admin
    await expect(usersService.update(adminUser.id, {nickname: 'Not admin'}, session)).rejects.toThrow(ForbiddenException);
  });



  it('[updateAdmin] should update isAdmin field and return updated user', async () => {
    const user = await usersService.create({ nickname: 'Joel', password: '12345678' });
    const updatedUser = await usersService.updateAdmin(user.id, true);
    expect(updatedUser.nickname).toEqual('Joel');
    expect(updatedUser.isAdmin).toEqual(true);
  });

  it('[updateAdmin] should throw a BadRequestException if user\'s id is invalid', async () => {
    await expect(usersService.updateAdmin(-10, true)).rejects.toThrow(BadRequestException);
  });

  it('[updateAdmin] should throw a NotFoundException if user\'s id doesn\'t exist', async () => {
    await expect(usersService.updateAdmin(123, true)).rejects.toThrow(NotFoundException);
  });

  

  it('[remove] should delete a user with given ID and return them when deleting self', async () => {
    
    const user = await usersService.create({ nickname: 'Joel', password: '12345678' });
    const session: Record<string, any> = {userId: user.id};

    const deletedUser = await usersService.remove(user.id, session);
    expect(deletedUser.nickname).toEqual('Joel');
    expect(deletedUser.id).toEqual(undefined);
    expect(session).not.toHaveProperty('userId');
  });

  it('[remove] should throw a BadRequestException if user\'s id is invalid', async () => {
    const session: Record<string, any> = {userId: 1};
    await expect(usersService.remove(undefined, session)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if user\'s id doesn\'t exist', async () => {
    const session: Record<string, any> = {userId: 1};
    await expect(usersService.remove(123, session)).rejects.toThrow(NotFoundException);
  });

  it('[remove] should keep session if deletion did not succeed', async () => {
    const session: Record<string, any> = {userId: 1};
    await expect(usersService.remove(99, session)).rejects.toThrow(NotFoundException);
    expect(session).toHaveProperty('userId');
  });

  it('[remove] should keep session if deletion was initiated by a different user (admin)', async () => {
    const adminUser = await usersService.create({ nickname: 'Admin', password: '12345678' });
    await usersService.updateAdmin(adminUser.id, true);

    const session: Record<string, any> = {userId: adminUser.id};

    const user = await usersService.create({ nickname: 'Joel', password: '12345678' });

    const deletedUser = await usersService.remove(user.id, session);
    expect(deletedUser.nickname).toEqual('Joel');
    expect(deletedUser.id).toEqual(undefined);
    expect(session).toHaveProperty('userId');
  });

  it('[remove] should work only of user is updating self or admin', async () => {
    const adminUser = await usersService.create({ nickname: 'Admin', password: '12345678' });
    await usersService.updateAdmin(adminUser.id, true);

    let commonUser = await usersService.create({ nickname: 'Jole', password: '12345678' });

    // admin deletes common user
    let session: Record<string, any> = {userId: adminUser.id};
    let deletedUser = await usersService.remove(commonUser.id, session);
    expect(deletedUser.id).toEqual(undefined);

    // user deletes self
    commonUser = await usersService.create({ nickname: 'Jole', password: '12345678' });
    session = {userId: commonUser.id};
    deletedUser = await usersService.remove(commonUser.id, session);
    expect(deletedUser.id).toEqual(undefined);
    expect(session).not.toHaveProperty('userId');

    // user tries to deletes admin
    commonUser = await usersService.create({ nickname: 'Jole', password: '12345678' });
    session = {userId: commonUser.id};
    await expect(usersService.update(adminUser.id, {nickname: 'Not admin'}, session)).rejects.toThrow(ForbiddenException);
  });
});
