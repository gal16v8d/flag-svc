import {
  Body,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HeaderGuard } from '../guard/auth.guard';
import { CacheService } from '../service/cache.service';
import { GenericService } from '../service/generic.service';

/**
 * Include the basic CRUD operations for any controller.
 *
 * @param S schema related data object
 * @param R request data
 */
@UseGuards(HeaderGuard)
export abstract class GenericController<S, R> {
  private readonly logger = new Logger(GenericController.name);

  constructor(
    private readonly service: GenericService<S, R>,
    readonly cache: CacheService,
  ) {}

  @Post()
  async create(@Body() requestData: R) {
    await this.service.create(requestData);
    this.cache.deleteAll(this.service.getKey());
  }

  @Get()
  async find(
    @Query(
      'expanded',
      new DefaultValuePipe(false),
      new ParseBoolPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    expanded: boolean,
    @Query('name') name?: string,
  ): Promise<S | S[]> {
    if (name) {
      return this.findByName(name, expanded);
    }
    return this.findAll(expanded);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query(
      'expanded',
      new DefaultValuePipe(false),
      new ParseBoolPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    expanded: boolean,
  ): Promise<S> {
    const key = `${this.service.getKey()}-${id}-${expanded}`;
    const cacheData = await this.cache.get(key);
    if (cacheData) {
      this.logger.debug('findOne from cache', { key, cacheData });
      return cacheData as unknown as S;
    }
    this.logger.debug('findOne not found in cache', key);
    const data = await this.service.findOne(id, expanded);
    this.checkExistence(data);
    this.cache.set(key, data);
    return data;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() requestData: R): Promise<S> {
    const data = await this.service.update(id, requestData);
    this.checkExistence(data);
    this.cache.deleteAll(this.service.getKey());
    return data;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const data = await this.service.delete(id);
    this.checkExistence(data);
    this.cache.deleteAll(this.service.getKey());
    return data;
  }

  private async findAll(expanded: boolean): Promise<S[]> {
    const key = this.service.getKey();
    const cacheData = await this.cache.get(key);
    if (cacheData) {
      this.logger.debug('findAll from cache', { key, cacheData });
      return cacheData as unknown as S[];
    }
    this.logger.debug('findAll not found in cache', key);
    const data = await this.service.findAll(expanded);
    this.cache.set(key, data);
    return data;
  }

  private async findByName(name: string, expanded: boolean): Promise<S> {
    const key = `${this.service.getKey()}-${name}-${expanded}`;
    const cacheData = await this.cache.get(key);
    if (cacheData) {
      this.logger.debug('findByName from cache', { key, cacheData });
      return cacheData as unknown as S;
    }
    this.logger.debug('findByName not found in cache', key);
    const data = await this.service.findByName(name, expanded);
    this.checkExistence(data);
    this.cache.set(key, data);
    return data;
  }

  checkExistence(data: S) {
    if (!data) {
      throw new NotFoundException();
    }
  }
}
