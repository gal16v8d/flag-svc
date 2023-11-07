import { AppDto } from '@app/model/dto/app.dto';
import { App } from '@app/model/schema/app.schema';
import { AppDbService } from '@app/service/appdb.service';
import { CacheService } from '@app/service/cache.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenericController } from './generic.controller';

@ApiTags('Apps Controller')
@Controller('api/apps')
export class AppDbController extends GenericController<App, AppDto> {
  constructor(
    readonly appService: AppDbService,
    readonly cacheService: CacheService,
  ) {
    super(appService, cacheService);
  }
}
