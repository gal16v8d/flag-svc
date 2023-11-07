import { FlagDto } from '@app/model/dto/flag.dto';
import { Flag } from '@app/model/schema/flag.schema';
import { CacheService } from '@app/service/cache.service';
import { FlagService } from '@app/service/flag.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
