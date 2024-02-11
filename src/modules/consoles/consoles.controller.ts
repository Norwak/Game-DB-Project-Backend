import { Controller } from '@nestjs/common';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ConsoleDto } from './dtos/console.dto';
import { BaseCrudController } from '../../common/base-crud/base-crud.controller';
import { Console } from './entities/console.entity';
import { ConsolesService } from './consoles.service';

@Controller('consoles')
@Serialize(ConsoleDto)
export class ConsolesController extends BaseCrudController<Console> {
  constructor(
    private consolesService: ConsolesService
  ) {
    super(consolesService);
  }
}
