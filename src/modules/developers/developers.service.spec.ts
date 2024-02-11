import { Test, TestingModule } from '@nestjs/testing';
import { DevelopersService } from './developers.service';
import { Developer } from './entities/developer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';

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
    await developersService.create({ title: 'Konami' });

    const developers = await developersService.find('Konami');
    expect(developers.length).toEqual(1);
    expect(developers[0].title).toEqual('Konami');
  });

  it('[find] should return an array of developers matching search query #2', async () => {
    await developersService.create({ title: 'Konami' });
    await developersService.create({ title: 'Capcom' });
    await developersService.create({ title: 'Bethesda' });

    const developers = await developersService.find('m');
    expect(developers.length).toEqual(2);
    expect(developers[0].title).toEqual('Konami');
    expect(developers[1].title).toEqual('Capcom');
  });

  it('[find] should return an empty array', async () => {
    await developersService.create({ title: 'Konami' });
    await developersService.create({ title: 'Capcom' });
    await developersService.create({ title: 'Bethesda' });

    const developers = await developersService.find('q');
    expect(developers.length).toEqual(0);
  });



  it('[findOne] should return a developer with given id', async () => {
    const developer = await developersService.create({ title: 'Konami' });

    const foundDeveloper = await developersService.findOne(developer.id);
    expect(foundDeveloper.title).toEqual('Konami');
  });

  it('[findOne] should throw a NotFoundException if developer\'s id doesn\'t exist', async () => {
    await expect(developersService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if developer\'s id isn\'t valid', async () => {
    await expect(developersService.findOne(-15)).rejects.toThrow(BadRequestException);
    await expect(developersService.findOne(undefined)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create a developer with given title and return them', async () => {
    const createdDeveloper = await developersService.create({ title: 'Konami' });
    expect(createdDeveloper.title).toEqual('Konami');
  });

  it('[create] should throw a BadRequestException if developer\'s name is invalid', async () => {
    await expect(developersService.create({ title: '' })).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if developer\'s name already exists', async () => {
    await developersService.create({ title: 'Konami' });
    await expect(developersService.create({ title: 'Konami' })).rejects.toThrow(BadRequestException);
  });



  it('[update] should update a developer\'s data with given ID and return updated developer', async () => {
    const developer = await developersService.create({ title: 'Konaim' });
    const updatedDeveloper = await developersService.update(developer.id, {title: 'Konami'});
    expect(updatedDeveloper.title).toEqual('Konami');
  });

  it('[update] should throw a BadRequestException if developer\'s id is invalid', async () => {
    const developer = await developersService.create({ title: 'Konaim' });
    await expect(developersService.update(-10, { title: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if developer\'s id doesn\'t exist', async () => {
    await expect(developersService.update(123, { title: '' })).rejects.toThrow(NotFoundException);
  });

  

  it('[remove] should delete a developer with given ID and return them', async () => {
    const developer = await developersService.create({ title: 'Konami' });
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
