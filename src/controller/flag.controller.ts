import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FlagDto } from '../model/dto/flag.dto';
import { Flag } from '../model/schema/flag.schema';
import { CacheService } from '../service/cache.service';
import { FlagService } from '../service/flag.service';
import { GenericController } from './generic.controller';

@ApiTags('Flag Controller')
@Controller('api/flags')
export class FlagController extends GenericController<Flag, FlagDto> {
  constructor(
    readonly flagService: FlagService,
    readonly cacheService: CacheService,
  ) {
    super(flagService, cacheService);
  }
}
