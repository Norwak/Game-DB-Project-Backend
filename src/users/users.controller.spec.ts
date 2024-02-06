import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { setAdminDto } from './dtos/set-admin.dto';
import { PrivilegesService } from './privileges.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  let fakePrivilegesService: Partial<PrivilegesService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: jest.fn(),
      findSome: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    fakeAuthService = {
      signup: jest.fn(),
      signin: jest.fn(),
      signout: jest.fn(),
    }

    fakePrivilegesService = {
      setAdmin: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: PrivilegesService,
          useValue: fakePrivilegesService,
        },
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



  it('[signup] should return a user back with assigned id', async () => {
    fakeAuthService.signup = () => {
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: '12345678',
        lastLogin: new Date('2000-01-01T01:01:01.000Z'),
        registrationDate: new Date('2000-01-01T01:01:01.000Z')
      } as User);
    }

    const user = await usersController.signup({nickname: 'Joel', password: '12345678'});
    expect(user).toHaveProperty('id');
  });

  it('[signup] should throw BadRequestException if nickname isn\'t valid', async () => {
    fakeAuthService.signup = () => {
      throw new BadRequestException('nickname shouldn\'t be empty');
    }

    await expect(usersController.signup({nickname: '', password: '12345678'})).rejects.toThrow(BadRequestException);
  });



  it('[signin] should return a user if success and update session', async () => {
    fakeAuthService.signin = (createUserDto: CreateUserDto, session: Record<string, any>) => {
      session.userId = 1;
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: '12345678',
        lastLogin: new Date('2000-01-01T01:01:01.000Z'),
        registrationDate: new Date('2000-01-01T01:01:01.000Z')
      } as User);
    }

    const session: Record<string, any> = {};
    const user = await usersController.signin({nickname: 'Joel', password: '12345678'}, session);
    expect(user).toHaveProperty('id');
    expect(session).toHaveProperty('userId');
  });



  it('[whoami] should return current user object', async () => {
    fakeUsersService.findOne = () => {
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: '12345678',
        lastLogin: new Date('2000-01-01T01:01:01.000Z'),
        registrationDate: new Date('2000-01-01T01:01:01.000Z')
      } as User);
    }

    const session: Record<string, any> = {userId: 1};
    const currentUser = await usersController.whoami(session);
    expect(currentUser.id).toEqual(session.userId);
  });



  it('[signout] should clear the session', () => {
    fakeAuthService.signout = (session: Record<string, any>) => {
      delete session.userId;
      return {};
    }

    const session: Record<string, any> = {userId: 1};
    const result = usersController.signout(session);
    expect(result).toEqual({});
    expect(session).not.toHaveProperty('userId');
  });



  it('[update] should return a user with updated data', async () => {
    fakeUsersService.update = () => {
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: '12345678',
        lastLogin: new Date('2000-01-01T01:01:01.000Z'),
        registrationDate: new Date('2000-01-01T01:01:01.000Z')
      } as User);
    }

    const session: Record<string, any> = {userId: 1};
    const updatedUser = await usersController.update(1, {nickname: 'Joel'}, session);
    expect(updatedUser.id).toEqual(1);
    expect(updatedUser.nickname).toEqual('Joel');
  });



  it('[setAdmin] should a user with updated admin field', async () => {
    fakePrivilegesService.setAdmin = () => {
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: '12345678',
        lastLogin: new Date('2000-01-01T01:01:01.000Z'),
        registrationDate: new Date('2000-01-01T01:01:01.000Z'),
        isAdmin: true,
      } as User);
    }

    const userId = 1;
    const adminKey = 'jf8t24ty';
    const value = true;

    const updatedUser = await usersController.setAdmin({userId, adminKey, value});
    expect(updatedUser.id).toEqual(1);
    expect(updatedUser.isAdmin).toEqual(true);
  });



  it('[remove] should delete a user by id, sign out and return user object back without id', async () => {
    fakeUsersService.remove = (id: number, session: Record<string, any>) => {
      delete session.userId;
      return Promise.resolve({
        nickname: 'Joel',
        password: '12345678',
        lastLogin: new Date('2000-01-01T01:01:01.000Z'),
        registrationDate: new Date('2000-01-01T01:01:01.000Z')
      } as User);
    }

    const session: Record<string, any> = {userId: 1};
    const deletedUser = await usersController.remove(1, session);
    expect(deletedUser.nickname).toEqual('Joel');
    expect(deletedUser).not.toHaveProperty('id');
    expect(session).not.toHaveProperty('userId');
  });
});
