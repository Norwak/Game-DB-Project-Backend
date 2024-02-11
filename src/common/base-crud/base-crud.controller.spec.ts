import { Test, TestingModule } from '@nestjs/testing';
import { BaseCrudController } from './base-crud.controller';
import { BaseCrudEntity } from './entities/base-crud.entity';
import { BaseCrudService } from './base-crud.service';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { User } from '../../modules/users/entities/user.entity';

describe('BaseCrudController', () => {
  let baseCrudController: BaseCrudController<BaseCrudEntity>;
  let fakeBaseCrudService: Partial<BaseCrudService<BaseCrudEntity>>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeBaseCrudService = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    fakeUsersService = {
      findOne: () => {
        return Promise.resolve({
          isAdmin: true
        } as User);
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseCrudController],
      providers: [
        {
          provide: 'service',
          useValue: fakeBaseCrudService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ]
    }).compile();

    baseCrudController = module.get<BaseCrudController<BaseCrudEntity>>(BaseCrudController);
  });

  it('should be defined', () => {
    expect(baseCrudController).toBeDefined();
  });



  it('[find] should return an array with items that match search query', async () => {
    fakeBaseCrudService.find = () => {
      return Promise.resolve([{id: 1, title: 'Action'} as BaseCrudEntity]);
    }

    const items = await baseCrudController.find('Ion');
    expect(items.length).toEqual(1);
  });



  it('[findOne] should return the item with given id', async () => {
    fakeBaseCrudService.findOne = () => {
      return Promise.resolve({id: 1, title: 'Action'} as BaseCrudEntity);
    }

    const item = await baseCrudController.findOne(1);
    expect(item.title).toEqual('Action');
  });



  it('[create] should return an item back with assigned id', async () => {
    fakeBaseCrudService.create = () => {
      return Promise.resolve({id: 1, title: 'Action'} as BaseCrudEntity);
    }

    const item = await baseCrudController.create({title: 'Action'});
    expect(item).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if title isn\'t valid', async () => {
    fakeBaseCrudService.create = () => {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    await expect(baseCrudController.create({title: undefined})).rejects.toThrow(BadRequestException);
  });



  it('[update] should return an item with updated data', async () => {
    fakeBaseCrudService.update = () => {
      return Promise.resolve({id: 1, title: 'Action'} as BaseCrudEntity);
    }

    const updatedItem = await baseCrudController.update(1, {title: 'Action'});
    expect(updatedItem.id).toEqual(1);
    expect(updatedItem.title).toEqual('Action');
  });



  it('[remove] should delete an item by id and return it\'s object back without id', async () => {
    fakeBaseCrudService.remove = () => {
      return Promise.resolve({title: 'Action'} as BaseCrudEntity);
    }

    const deletedItem = await baseCrudController.remove(1);
    expect(deletedItem.title).toEqual('Action');
    expect(deletedItem).not.toHaveProperty('id');
  });
});
