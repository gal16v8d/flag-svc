import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppDto } from '../model/dto/app.dto';
import { App, AppDocument } from '../model/schema/app.schema';
import { GenericService } from './generic.service';

@Injectable()
export class AppDbService extends GenericService<App, AppDto> {
  constructor(
    @InjectModel(App.name) private readonly appModel: Model<AppDocument>,
  ) {
    super(appModel);
  }
}
