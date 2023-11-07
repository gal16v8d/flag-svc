import { AppDto } from '@app/model/dto/app.dto';
import { App, AppDocument } from '@app/model/schema/app.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericService } from './generic.service';

@Injectable()
export class AppDbService extends GenericService<App, AppDto> {
  constructor(@InjectModel(App.name) readonly appModel: Model<AppDocument>) {
    super(appModel);
  }
}
