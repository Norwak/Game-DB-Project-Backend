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
