import { Test, TestingModule } from '@nestjs/testing';
import { DevelopersService } from './developers.service';
import { Developer } from './entities/developer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, FindOperator, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

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
                return Promise.resolve(results[0]);
              } else {
                return Promise.resolve({});
              }
            },
            findOne: (id: number) => {
              const results = fakeDb.filter(developer => developer.id === id);
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

  it('should create a developer with given title', async () => {
    const developer = await developersService.create('Konami');
    expect(developer.title).toEqual('Konami');
  });

  it('create should return null if developer\'s name is invalid', async () => {
    const nullValue = await developersService.create('');
    expect(nullValue).toEqual(null);
  });

  it('create should return null if developer\'s name already exists', async () => {
    await developersService.create('Konami');
    const nullValue = await developersService.create('Konami');
    expect(nullValue).toEqual(null);
  });

  it('should delete a developer', async () => {
    const developer = await developersService.create('Konami');
    const deletedDeveloper = await developersService.remove(developer.id);
    expect(deletedDeveloper).toBeDefined();
  });

  it('remove should return null if developer\'s id is invalid', async () => {
    const nullValue = await developersService.remove(null);
    expect(nullValue).toEqual(null);
  });

  it('remove should return null if developer\'s id doesn\'t exists', async () => {
    const nullValue = await developersService.remove(123);
    expect(nullValue).toEqual(null);
  });
});
