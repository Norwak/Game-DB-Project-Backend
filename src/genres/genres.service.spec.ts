import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('GenresService', () => {
  let genresService: GenresService;
  let testingModule: TestingModule;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    testingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: dataSource.getRepository(Genre),
        },
      ],
    }).compile();

    genresService = testingModule.get<GenresService>(GenresService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(genresService).toBeDefined();
  });



  it('[find] should return an array of genres matching search query #1', async () => {
    await genresService.create({ title: 'Action' });

    const genres = await genresService.find('Action');
    expect(genres.length).toEqual(1);
    expect(genres[0].title).toEqual('Action');
  });

  it('[find] should return an array of genres matching search query #2', async () => {
    await genresService.create({ title: 'Action' });
    await genresService.create({ title: 'Adventure' });
    await genresService.create({ title: 'Puzzle' });

    const genres = await genresService.find('A');
    expect(genres.length).toEqual(2);
    expect(genres[0].title).toEqual('Action');
    expect(genres[1].title).toEqual('Adventure');
  });

  it('[find] should return an empty array if no results found', async () => {
    await genresService.create({ title: 'Action' });
    await genresService.create({ title: 'Adventure' });
    await genresService.create({ title: 'Puzzle' });

    const genres = await genresService.find('q');
    expect(genres.length).toEqual(0);
  });



  it('[findSome] should return an array of genres by ids', async () => {
    await genresService.create({ title: 'Action' });
    await genresService.create({ title: 'Adventure' });
    await genresService.create({ title: 'Puzzle' });

    const genres = await genresService.findSome([1, 2, 3]);
    expect(genres.length).toEqual(3);
    expect(genres[2].title).toEqual('Puzzle');
  });

  it('[findSome] should return an empty array of genres weren\'t found', async () => {
    const genres = await genresService.findSome([1, 2, 3]);
    expect(genres.length).toEqual(0);
  });



  it('[findOne] should return a genre with given id', async () => {
    const genre = await genresService.create({ title: 'Action' });

    const foundGenre = await genresService.findOne(genre.id);
    expect(foundGenre.title).toEqual('Action');
  });

  it('[findOne] should throw a NotFoundException if genre\'s id doesn\'t exist', async () => {
    await expect(genresService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if genre\'s id isn\'t valid', async () => {
    await expect(genresService.findOne(-15)).rejects.toThrow(BadRequestException);
    await expect(genresService.findOne(undefined)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create a genre with given title and return it', async () => {
    const createdGenre = await genresService.create({ title: 'Action' });
    expect(createdGenre.title).toEqual('Action');
  });

  it('[create] should throw a BadRequestException if genre\'s name is invalid', async () => {
    await expect(genresService.create({ title: '' })).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if genre\'s name already exists', async () => {
    await genresService.create({ title: 'Action' });
    await expect(genresService.create({ title: 'Action' })).rejects.toThrow(BadRequestException);
  });



  it('[update] should update a genre\'s data with given ID and return updated genre', async () => {
    const genre = await genresService.create({ title: 'CAtion' });
    const updatedGenre = await genresService.update(genre.id, {title: 'Action'});
    expect(updatedGenre.title).toEqual('Action');
  });

  it('[update] should throw a BadRequestException if genre\'s id is invalid', async () => {
    const genre = await genresService.create({ title: 'Konaim' });
    await expect(genresService.update(-10, { title: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if genre\'s id doesn\'t exist', async () => {
    await expect(genresService.update(123, { title: '' })).rejects.toThrow(NotFoundException);
  });



  it('[remove] should delete a genre with given ID and return it', async () => {
    const genre = await genresService.create({ title: 'Action' });
    const deletedGenre = await genresService.remove(genre.id);
    expect(deletedGenre).toBeDefined();
  });

  it('[remove] should throw a BadRequestException if genre\'s id is invalid', async () => {
    await expect(genresService.remove(undefined)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if genre\'s id doesn\'t exist', async () => {
    await expect(genresService.remove(123)).rejects.toThrow(NotFoundException);
  });



  
});
