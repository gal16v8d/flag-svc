import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  NotFoundException,
  ParseBoolPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Flag } from '../model/schema/flag.schema';
import { FlagService } from '../service/flag.service';

@ApiTags('Flag Controller')
@Controller('api/flags')
export class FlagExtController {
  constructor(readonly flagService: FlagService) {}

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

  checkExistence(data: Flag) {
    if (!data) {
      throw new NotFoundException();
    }
  }
}
