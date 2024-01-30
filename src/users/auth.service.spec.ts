import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { PasswordService } from './password.service';
import { User } from './entities/user.entity';

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



  it('should signup a user', async () => {
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
});
