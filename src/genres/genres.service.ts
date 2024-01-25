import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dtos/create-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre) private genresRepository: Repository<Genre>
  ) {}

  async create({title}: CreateGenreDto) {
    if (!title || title === '') {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    const genres = await this.genresRepository.find({where: {title}});
    if (genres.length > 0) {
      throw new BadRequestException('genre already exists');
    }

    const genre = this.genresRepository.create({title});
    return await this.genresRepository.save(genre);
  }

  async remove(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const genre = await this.genresRepository.findOne({where: {id}});
    if (!genre) {
      throw new NotFoundException('genre not found with given id');
    }

    return await this.genresRepository.remove(genre);
  }
}
