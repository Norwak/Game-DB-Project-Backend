import { Controller } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { DeveloperDto } from './dtos/developer.dto';
import { BaseCrudController } from '../../common/base-crud/base-crud.controller';
import { Developer } from './entities/developer.entity';

@Controller('developers')
@Serialize(DeveloperDto)
export class DevelopersController extends BaseCrudController<Developer> {
  constructor(
    private developersService: DevelopersService
  ) {
    super(developersService);
  }
}
