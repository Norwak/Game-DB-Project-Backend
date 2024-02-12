import { Controller } from '@nestjs/common';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ConsoleDto } from './dtos/console.dto';
import { BaseDictionaryController } from '../../common/base-dictionary/base-dictionary.controller';
import { Console } from './entities/console.entity';
import { ConsolesService } from './consoles.service';

@Controller('consoles')
@Serialize(ConsoleDto)
export class ConsolesController extends BaseDictionaryController<Console> {
  constructor(
    private consolesService: ConsolesService
  ) {
    super(consolesService);
  }
}
