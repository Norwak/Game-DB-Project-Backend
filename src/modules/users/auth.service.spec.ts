import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { PasswordService } from './password.service';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;
  let fakePasswordService: Partial<PasswordService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    fakePasswordService = {
      encrypt: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: PasswordService,
          useValue: fakePasswordService
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });



  it('should be defined', () => {
    expect(authService).toBeDefined();
  });



  it('[signup] should create a user', async () => {
    fakePasswordService.encrypt = () => {
      return Promise.resolve('somesalt.somehash');
    }

    fakeUsersService.create = () => {
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: 'somesalt.somehash',
        registrationDate: new Date('2000-02-02T02:02:02.000Z'),
        lastLogin: new Date('2000-02-02T02:02:02.000Z'),
      } as User);
    }

    const newUser = await authService.signup({nickname: 'Joel', password: '12345678'});
    expect(newUser).toHaveProperty('id');
    expect(newUser).toHaveProperty('registrationDate');
    expect(newUser).toHaveProperty('lastLogin');

    expect(newUser.password).not.toEqual('12345678');
    const [salt, hash] = newUser.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });



  it('[signin] should verify a user, update session and update lastLogin', async () => {
    fakePasswordService.verify = () => {
      return Promise.resolve(true);
    }

    fakeUsersService.find = () => {
      return Promise.resolve([{
        id: 1,
        nickname: 'Joel',
        password: 'somesalt.somehash',
        registrationDate: new Date('2000-02-02T02:02:02.000Z'),
        lastLogin: new Date('2000-02-02T02:02:02.000Z'),
      } as User]);
    }

    fakeUsersService.update = () => {
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: 'somesalt.somehash',
        registrationDate: new Date('2000-02-02T02:02:02.000Z'),
        lastLogin: new Date(),
      } as User);
    }

    const session: Record<string, any> = {};
    const user = await authService.signin({nickname: 'Joel', password: '12345678'}, session);

    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(user.lastLogin.getFullYear()).toEqual(new Date().getFullYear());
    expect(session.userId).toEqual(1);
  });

  it('[signin] should throw a NotFoundException if user isn\'t found', async () => {
    fakeUsersService.find = () => {
      return Promise.resolve([]);
    };

    const session: Record<string, any> = {};
    await expect(authService.signin(
      {nickname: 'Joel', password: '12345678'},
      session
    )).rejects.toThrow(NotFoundException);
  });

  it('[signin] should throw a BadRequestException if passwords don\'t match', async () => {
    fakeUsersService.find = () => {
      return Promise.resolve([{
        id: 1,
        nickname: 'Joel',
        password: 'somesalt.somehash',
        registrationDate: new Date('2000-02-02T02:02:02.000Z'),
        lastLogin: new Date('2000-02-02T02:02:02.000Z'),
      } as User]);
    }

    fakePasswordService.verify = () => {
      return Promise.resolve(false);
    }

    const session: Record<string, any> = {};
    await expect(authService.signin(
      {nickname: 'Joel', password: '12345678'},
      session
    )).rejects.toThrow(BadRequestException);
  });



  it('[signout] should clear current session and return empty object on success', async () => {
    const session: Record<string, any> = {userId: 1};
    const result = authService.signout(session);

    expect(result).toEqual({});
    expect(session).not.toHaveProperty('userId');
  });

  it('[signout] should throw a BadRequestException if nobody is signed in', async () => {
    const session: Record<string, any> = {};
    expect(() => authService.signout(session)).toThrow(BadRequestException);
  });
});
