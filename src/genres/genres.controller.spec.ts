import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { Genre } from './entities/genre.entity';
import { BadRequestException } from '@nestjs/common';
import { CreateGenreDto } from './dtos/create-genre.dto';

describe('GenresController', () => {
  let genresController: GenresController;
  let fakeGenresService: Partial<GenresService>;

  beforeEach(async () => {
    fakeGenresService = {
      find: (query: string) => {
        return Promise.resolve([{
          id: 1,
          title: 'some title'
        } as Genre]);
      },
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          title: 'some title'
        } as Genre);
      },
      create: (item: CreateGenreDto) => {
        return Promise.resolve({
          id: 1,
          title: item.title
        } as Genre);
      },
      update: (id: number, newData: Partial<Genre>) => {
        return Promise.resolve({
          id,
          title: newData.title
        } as Genre);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          title: 'some title'
        } as Genre);
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        {
          provide: GenresService,
          useValue: fakeGenresService,
        }
      ]
    }).compile();

    genresController = module.get<GenresController>(GenresController);
  });

  it('should be defined', () => {
    expect(genresController).toBeDefined();
  });



  it('[find] should return an array with genres that match search query', async () => {
    fakeGenresService.find = () => {
      return Promise.resolve([{id: 1, title: 'Action'} as Genre]);
    }

    const genre = await genresController.find('Ion');
    expect(genre.length).toEqual(1);
  });



  it('[findOne] should return the genre with given id', async () => {
    fakeGenresService.findOne = () => {
      return Promise.resolve({id: 1, title: 'Action'} as Genre);
    }

    const genre = await genresController.findOne(1);
    expect(genre.title).toEqual('Action');
  });



  it('[create] should return a genre back with assigned id', async () => {
    fakeGenresService.create = () => {
      return Promise.resolve({id: 1, title: 'Action'} as Genre);
    }

    const genre = await genresController.create({title: 'Action'});
    expect(genre).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if title isn\'t valid', async () => {
    fakeGenresService.create = () => {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    await expect(genresController.create({title: undefined})).rejects.toThrow(BadRequestException);
  });



  it('[update] should return a genre with updated data', async () => {
    fakeGenresService.update = () => {
      return Promise.resolve({id: 1, title: 'Action'} as Genre);
    }

    const updatedGenre = await genresController.update(1, {title: 'Action'});
    expect(updatedGenre.id).toEqual(1);
    expect(updatedGenre.title).toEqual('Action');
  });



  it('[remove] should delete a genre by id and return genre object back without id', async () => {
    fakeGenresService.remove = () => {
      return Promise.resolve({title: 'Action'} as Genre);
    }

    const deletedGenre = await genresController.remove(1);
    expect(deletedGenre.title).toEqual('Action');
    expect(deletedGenre).not.toHaveProperty('id');
  });
});
