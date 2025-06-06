import { Flag } from '@app/model/schema/flag.schema';
import { CacheService } from '@app/service/cache.service';
import { FlagService } from '@app/service/flag.service';
import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Logger,
  NotFoundException,
  ParseBoolPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Flag Controller')
@Controller('api/flags')
export class FlagExtController {
  private readonly logger = new Logger(FlagExtController.name);

  constructor(
    readonly flagService: FlagService,
    readonly cacheService: CacheService,
  ) {}

  @Get()
  async findByNameAndAppId(
    @Query('name') name: string,
    @Query('appId') appId: string,
    @Query(
      'expanded',
      new DefaultValuePipe(false),
      new ParseBoolPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    expanded: boolean,
  ): Promise<Flag> {
    const key = `${this.flagService.getKey()}-${name}-${appId}-${expanded}`;
    const cacheData = await this.cacheService.get(key);
    if (cacheData) {
      this.logger.debug('findByNameAndAppId from cache', { key, cacheData });
      return cacheData as Flag;
    }
    this.logger.debug('findByNameAndAppId not found in cache', key);
    const data = await this.flagService.findByNameAndAppId(
      name,
      appId,
      expanded,
    );
    this.checkExistence(data);
    await this.cacheService.set(key, data);
    return data;
  }

  checkExistence(data: Flag) {
    if (!data) {
      throw new NotFoundException();
    }
  }
}
