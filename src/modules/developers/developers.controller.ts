import { Controller } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { DeveloperDto } from './dtos/developer.dto';
import { BaseDictionaryController } from '../../common/base-dictionary/base-dictionary.controller';
import { Developer } from './entities/developer.entity';

@Controller('developers')
@Serialize(DeveloperDto)
export class DevelopersController extends BaseDictionaryController<Developer> {
  constructor(
    private developersService: DevelopersService
  ) {
    super(developersService);
  }
}
