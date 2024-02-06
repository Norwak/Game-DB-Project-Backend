import { Test, TestingModule } from '@nestjs/testing';
import { PrivilegesService } from './privileges.service';
import { UsersService } from './users.service';
import { PasswordService } from './password.service';
import { User } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('PrivilegesService', () => {
  let privilegesService: PrivilegesService;
  let fakeUsersService: Partial<UsersService>;
  let fakePasswordService: Partial<PasswordService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      updateAdmin: jest.fn(),
      remove: jest.fn()
    }

    fakePasswordService = {
      encrypt: jest.fn(),
      verify: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrivilegesService,
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

    privilegesService = module.get<PrivilegesService>(PrivilegesService);
  });



  it('should be defined', () => {
    expect(privilegesService).toBeDefined();
  });



  it('[setAdmin] should verify admin key, then change user\'s admin privileges and return user with updated admin property', async () => {
    fakeUsersService.updateAdmin = () => {
      return Promise.resolve({
        id: 1,
        nickname: 'Joel',
        password: 'somesalt.somepassword',
        registrationDate: new Date('2000-02-02T02:02:02.000Z'),
        lastLogin: new Date('2000-02-02T02:02:02.000Z'),
        isAdmin: true
      } as User)
    }

    fakePasswordService.verify = () => {
      return Promise.resolve(true);
    }

    const userId = 1;
    const adminKey = '12345678';
    const value = true;
    const updatedUser = await privilegesService.setAdmin(userId, adminKey, value);

    expect(updatedUser.id).toEqual(1);
    expect(updatedUser.isAdmin).toEqual(true);
  });

  it('[setAdmin] should throw a BadRequestExpection if admin key is wrong', async () => {
    fakePasswordService.verify = () => {
      return Promise.resolve(false);
    }

    const userId = 1;
    const adminKey = 'ahjgf842';
    const value = true;
    await expect(privilegesService.setAdmin(userId, adminKey, value)).rejects.toThrow(BadRequestException);
  });
});
