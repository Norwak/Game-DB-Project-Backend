import { Test, TestingModule } from '@nestjs/testing';
import { DevelopersService } from './developers.service';
import { Developer } from './entities/developer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, FindOperator, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('DevelopersService', () => {
  let developersService: DevelopersService;
  let fakeDevelopersRepository: Repository<Developer>;
  let fakeDb = [];

  beforeEach(async () => {
    fakeDb = []

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevelopersService,
        {
          provide: getRepositoryToken(Developer),
          // define all the methods that you use from the catRepo
          // give proper return values as expected or mock implementations, your choice
          useValue: {
            find: (options: FindManyOptions<Developer>) => {
              // @ts-ignore
              const results = fakeDb.filter(developer => developer.title === options.where.title);
              if (results) {
                return Promise.resolve(results);
              } else {
                return Promise.resolve({});
              }
            },
            findOne: (options: FindManyOptions<Developer>) => {
              // @ts-ignore
              const results = fakeDb.filter(developer => developer.id === options.where.id);
              if (results) {
                return Promise.resolve(results[0]);
              } else {
                return Promise.resolve({});
              }
            },
            create: ({title}) => {
              return {
                id: Math.floor((Math.random() * 999999)),
                title,
              };
            },
            save: (developer: Developer) => {
              fakeDb.push(developer);
              return Promise.resolve(developer);
            },
            remove: (developer: Developer) => {
              fakeDb = fakeDb.filter(item => item.id !== developer.id);
              return Promise.resolve(developer);
            }
          },
        },
      ],
    }).compile();

    developersService = module.get<DevelopersService>(DevelopersService);
    fakeDevelopersRepository = module.get<Repository<Developer>>(getRepositoryToken(Developer));
  });

  it('should be defined', () => {
    expect(developersService).toBeDefined();
  });



  it('[find] should return an array of developers matching search query #1', async () => {
    await developersService.create('Konami');

    const developers = await developersService.find({title: 'Konami'});
    expect(developers.length).toEqual(1);
    expect(developers[0].title).toEqual('Konami');
  });

  it('[find] should return an array of developers matching search query #2', async () => {
    await developersService.create('Konami');
    await developersService.create('Capcom');
    await developersService.create('Bethesda');

    const developers = await developersService.find({title: 'm'});
    expect(developers.length).toEqual(2);
    expect(developers[0].title).toEqual('Konami');
    expect(developers[1].title).toEqual('Capcom');
  });

  it('[find] should return an empty array', async () => {
    await developersService.create('Konami');
    await developersService.create('Capcom');
    await developersService.create('Bethesda');

    const developers = await developersService.find({title: 'q'});
    expect(developers.length).toEqual(0);
  });



  it('[create] should create a developer with given title and return them', async () => {
    const createdDeveloper = await developersService.create('Konami');
    expect(createdDeveloper.title).toEqual('Konami');
  });

  it('[create] should throw a BadRequestException if developer\'s name is invalid', async () => {
    await expect(developersService.create('')).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if developer\'s name already exists', async () => {
    await developersService.create('Konami');
    await expect(developersService.create('Konami')).rejects.toThrow(BadRequestException);
  });



  it('[update] should update a developer\'s data with given ID and return updated developer', async () => {
    const developer = await developersService.create('Konaim');
    const updatedDeveloper = await developersService.update(developer.id, {title: 'Konami'});
    expect(updatedDeveloper.title).toEqual('Konami');
  });

  it('[update] should throw a BadRequestException if developer\'s id is invalid', async () => {
    const developer = await developersService.create('Konaim');
    await expect(developersService.update(-10, {})).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if developer\'s id doesn\'t exist', async () => {
    await expect(developersService.update(123, {})).rejects.toThrow(NotFoundException);
  });

  

  it('[remove] should delete a developer with given ID and return them', async () => {
    const developer = await developersService.create('Konami');
    const deletedDeveloper = await developersService.remove(developer.id);
    expect(deletedDeveloper).toBeDefined();
  });

  it('[remove] should throw a BadRequestException if developer\'s id is invalid', async () => {
    await expect(developersService.remove(undefined)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if developer\'s id doesn\'t exist', async () => {
    await expect(developersService.remove(123)).rejects.toThrow(NotFoundException);
  });
});
