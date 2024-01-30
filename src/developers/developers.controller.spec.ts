import { Test, TestingModule } from '@nestjs/testing';
import { DevelopersController } from './developers.controller';
import { DevelopersService } from './developers.service';
import { Developer } from './entities/developer.entity';
import { CreateDeveloperDto } from './dtos/create-developer.dto';
import { BadRequestException } from '@nestjs/common';

describe('DevelopersController', () => {
  let developersController: DevelopersController;
  let fakeDevelopersService: Partial<DevelopersService>;

  beforeEach(async () => {
    fakeDevelopersService = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevelopersController],
      providers: [
        {
          provide: DevelopersService,
          useValue: fakeDevelopersService,
        }
      ]
    }).compile();

    developersController = module.get<DevelopersController>(DevelopersController);
  });



  it('should be defined', () => {
    expect(developersController).toBeDefined();
  });



  it('[find] should return an array with developers that match search query', async () => {
    fakeDevelopersService.find = () => {
      return Promise.resolve([{id: 1, title: 'Konami'} as Developer]);
    }

    const developer = await developersController.find('Kon');
    expect(developer.length).toEqual(1);
  });



  it('[findOne] should return the developer with given id', async () => {
    fakeDevelopersService.findOne = () => {
      return Promise.resolve({id: 1, title: 'Konami'} as Developer);
    }

    const developer = await developersController.findOne(1);
    expect(developer.title).toEqual('Konami');
  });



  it('[create] should return a developer back with assigned id', async () => {
    fakeDevelopersService.create = () => {
      return Promise.resolve({id: 1, title: 'Konami'} as Developer);
    }

    const developer = await developersController.create({title: 'Konami'});
    expect(developer).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if title isn\'t valid', async () => {
    fakeDevelopersService.create = () => {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    await expect(developersController.create({title: undefined})).rejects.toThrow(BadRequestException);
  });



  it('[update] should return a developer with updated data', async () => {
    fakeDevelopersService.update = () => {
      return Promise.resolve({id: 1, title: 'Konami'} as Developer);
    }

    const updatedDeveloper = await developersController.update(1, {title: 'Konami'});
    expect(updatedDeveloper.id).toEqual(1);
    expect(updatedDeveloper.title).toEqual('Konami');
  });



  it('[remove] should delete a develper by id and return developer object back without id', async () => {
    fakeDevelopersService.remove = () => {
      return Promise.resolve({title: 'Konami'} as Developer);
    }

    const deletedDeveloper = await developersController.remove(1);
    expect(deletedDeveloper.title).toEqual('Konami');
    expect(deletedDeveloper).not.toHaveProperty('id');
  });
});
