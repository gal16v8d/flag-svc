import { HeaderGuard } from '@app/guard/auth.guard';
import { CacheService } from '@app/service/cache.service';
import { GenericService } from '@app/service/generic.service';
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
    const data = await this.service.create(requestData);
    await this.cache.deleteAll(this.service.getKey());
    return data;
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
  ): Promise<Array<S> | S> {
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
    const key = `${this.service.getKey(expanded)}-${id}`;
    const cacheData = await this.cache.get(key);
    if (cacheData) {
      this.logger.debug('findOne from cache', { key, cacheData });
      return cacheData as S;
    }
    this.logger.debug('findOne not found in cache', key);
    let data: S;
    if (expanded) {
      data = await this.service.findOneExpanded(id);
    } else {
      data = await this.service.findOne(id);
    }
    this.checkExistence(data);
    await this.cache.set(key, data);
    return data;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() requestData: R): Promise<S> {
    const data = await this.service.update(id, requestData);
    this.checkExistence(data);
    await this.cache.deleteAll(this.service.getKey());
    return data;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    await this.cache.deleteAll(this.service.getKey());
  }

  private async findAll(expanded: boolean): Promise<Array<S>> {
    const key = this.service.getKey(expanded);
    const cacheData = await this.cache.get(key);
    if (cacheData) {
      this.logger.debug('findAll from cache', { key, cacheData });
      return cacheData as Array<S>;
    }
    this.logger.debug('findAll not found in cache', key);
    let data: Array<S>;
    if (expanded) {
      data = await this.service.findAllExpanded();
    } else {
      data = await this.service.findAll();
    }
    await this.cache.set(key, data);
    return data;
  }

  private async findByName(name: string, expanded: boolean): Promise<S> {
    const key = `${this.service.getKey(expanded)}-${name}`;
    const cacheData = await this.cache.get(key);
    if (cacheData) {
      this.logger.debug('findByName from cache', { key, cacheData });
      return cacheData as S;
    }
    this.logger.debug('findByName not found in cache', key);
    let data: S;
    if (expanded) {
      data = await this.service.findByNameExpanded(name);
    } else {
      data = await this.service.findByName(name);
    }
    this.checkExistence(data);
    await this.cache.set(key, data);
    return data;
  }

  checkExistence(data: S) {
    if (!data) {
      throw new NotFoundException();
    }
  }
}
