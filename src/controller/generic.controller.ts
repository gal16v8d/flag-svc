import {
  Body,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HeaderGuard } from '../guard/auth.guard';
import { GenericService } from '../service/generic.service';

/**
 * Include the basic CRUD operations for any controller.
 *
 * @param S schema related data object
 * @param R request data
 */
@UseGuards(HeaderGuard)
export abstract class GenericController<S, R> {
  constructor(private readonly service: GenericService<S, R>) {}

  @Post()
  async create(@Body() requestData: R) {
    await this.service.create(requestData);
  }

  @Get()
  async findAll(
    @Query(
      'expanded',
      new DefaultValuePipe(false),
      new ParseBoolPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    expanded: boolean,
  ): Promise<S[]> {
    return this.service.findAll(expanded);
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
    const data = await this.service.findOne(id, expanded);
    this.checkExistence(data);
    return data;
  }

  @Get()
  async findByName(
    @Query('name') name: string,
    @Query(
      'expanded',
      new DefaultValuePipe(false),
      new ParseBoolPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    expanded: boolean,
  ): Promise<S> {
    const data = await this.service.findByName(name, expanded);
    this.checkExistence(data);
    return data;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() requestData: R): Promise<S> {
    const data = await this.service.update(id, requestData);
    this.checkExistence(data);
    return data;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const data = await this.service.delete(id);
    this.checkExistence(data);
    return data;
  }

  checkExistence(data: S) {
    if (!data) {
      throw new NotFoundException();
    }
  }
}
