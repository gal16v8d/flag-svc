import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  ParseBoolPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HeaderGuard } from '../guard/auth.guard';
import { FlagDto } from '../model/dto/flag.dto';
import { Flag } from '../model/schema/flag.schema';
import { FlagService } from '../service/flag.service';
import { GenericController } from './generic.controller';

@ApiTags('Flag Controller')
@Controller('api/flags')
@UseGuards(HeaderGuard)
export class FlagController extends GenericController<Flag, FlagDto> {
  constructor(readonly flagService: FlagService) {
    super(flagService);
  }

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
    const data = await this.flagService.findByNameAndAppId(
      name,
      appId,
      expanded,
    );
    this.checkExistence(data);
    return data;
  }
}
