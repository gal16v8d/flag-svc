import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HeaderGuard } from '../guard/auth.guard';
import { AppDto } from '../model/dto/app.dto';
import { App } from '../model/schema/app.schema';
import { AppDbService } from '../service/appdb.service';
import { GenericController } from './generic.controller';

@ApiTags('Apps Controller')
@Controller('api/apps')
@UseGuards(HeaderGuard)
export class AppDbController extends GenericController<App, AppDto> {
  constructor(readonly appService: AppDbService) {
    super(appService);
  }
}
