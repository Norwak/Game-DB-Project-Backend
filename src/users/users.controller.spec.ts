import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (query: string) => {
        return Promise.resolve([{
          id: 1,
          nickname: 'some nickname'
        } as User]);
      },
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          nickname: 'some nickname'
        } as User);
      },
      create: (item: CreateUserDto) => {
        return Promise.resolve({
          id: 1,
          nickname: item.nickname
        } as User);
      },
      update: (id: number, newData: Partial<User>) => {
        return Promise.resolve({
          id,
          nickname: newData.nickname
        } as User);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          nickname: 'some nickname'
        } as User);
      }
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
      return Promise.resolve([{id: 1, nickname: 'Joel'} as User]);
    }

    const user = await usersController.find('j');
    expect(user.length).toEqual(1);
  });



  it('[findOne] should return the user with given id', async () => {
    fakeUsersService.findOne = () => {
      return Promise.resolve({id: 1, nickname: 'Joel'} as User);
    }

    const user = await usersController.findOne(1);
    expect(user.nickname).toEqual('Joel');
  });



  it('[create] should return a user back with assigned id', async () => {
    fakeUsersService.create = () => {
      return Promise.resolve({id: 1, nickname: 'Konami'} as User);
    }

    const user = await usersController.create({nickname: 'Konami'});
    expect(user).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if nickname isn\'t valid', async () => {
    fakeUsersService.create = () => {
      throw new BadRequestException('nickname shouldn\'t be empty');
    }

    await expect(usersController.create({nickname: undefined})).rejects.toThrow(BadRequestException);
  });



  it('[update] should return a user with updated data', async () => {
    fakeUsersService.update = () => {
      return Promise.resolve({id: 1, nickname: 'Konami'} as User);
    }

    const updatedUser = await usersController.update(1, {nickname: 'Konami'});
    expect(updatedUser.id).toEqual(1);
    expect(updatedUser.nickname).toEqual('Konami');
  });



  it('[remove] should delete a develper by id and return user object back without id', async () => {
    fakeUsersService.remove = () => {
      return Promise.resolve({nickname: 'Konami'} as User);
    }

    const deletedUser = await usersController.remove(1);
    expect(deletedUser.nickname).toEqual('Konami');
    expect(deletedUser).not.toHaveProperty('id');
  });
});
