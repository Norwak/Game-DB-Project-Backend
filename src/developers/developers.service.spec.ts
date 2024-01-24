import { Test, TestingModule } from '@nestjs/testing';
import { DevelopersService } from './developers.service';
import { Developer } from './entities/developer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository, getRepository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { dataSourceOptions } from '../../test/extra/dataSourceOptions';

describe('DevelopersService', () => {
  let developersService: DevelopersService;
  let testingModule: TestingModule;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    testingModule = await Test.createTestingModule({
      providers: [
        DevelopersService,
        {
          provide: getRepositoryToken(Developer),
          useValue: dataSource.getRepository(Developer),
        },
      ],
    }).compile();

    developersService = testingModule.get<DevelopersService>(DevelopersService);
  });

  afterEach(async () => {
    await dataSource.destroy();
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



  it('[findOne] should return a developer with given id', async () => {
    const developer = await developersService.create('Konami');

    const foundDeveloper = await developersService.findOne(developer.id);
    expect(developer.title).toEqual('Konami');
  });

  it('[findOne] should throw a NotFoundException if developer\'s id doesn\'t exist', async () => {
    await expect(developersService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if developer\'s id isn\'t valid', async () => {
    await expect(developersService.findOne(-15)).rejects.toThrow(BadRequestException);
    await expect(developersService.findOne(undefined)).rejects.toThrow(BadRequestException);
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
