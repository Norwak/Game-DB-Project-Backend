import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { AdminGuard } from '../../guards/admin.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { GameDto } from './dtos/game.dto';
import { SearchGamesDto } from './dtos/search-games.dto';
import { SearchDto } from './dtos/search.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { mutlerOptions } from '../../common/mutler-options';
import { imageRequirements } from '../../common/image-requirements';

@Controller('games')
@Serialize(GameDto)
export class GamesController {
  constructor(
    private gamesService: GamesService
  ) {}

  @Get()
  async find(@Query('q') query: string) {
    return await this.gamesService.find(query);
  }

  @Get('search')
  @Serialize(SearchDto)
  async search(@Query() query: SearchGamesDto) {
    return await this.gamesService.search(query);
  }

  @Get('alphabet')
  async alphabet(@Query('q') word: string) {
    return await this.gamesService.alphabet(word);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.gamesService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', mutlerOptions))
  async create(@Body() createGameDto: CreateGameDto, @UploadedFile(imageRequirements) image?: Express.Multer.File) {
    if (image) {
      createGameDto.imagePath = image.destination + image.filename;
    }
    return await this.gamesService.create(createGameDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', mutlerOptions))
  async update(@Param('id') id: number, @Body() updateGameDto: Partial<UpdateGameDto>, @UploadedFile(imageRequirements) image?: Express.Multer.File) {
    if (image) {
      updateGameDto.imagePath = image.destination + image.filename;
    }
    return await this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number) {
    return await this.gamesService.remove(id);
  }
}
