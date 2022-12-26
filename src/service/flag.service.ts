import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FlagDto } from '../model/dto/flag.dto';
import { Flag, FlagDocument } from '../model/schema/flag.schema';
import { GenericService } from './generic.service';

@Injectable()
export class FlagService extends GenericService<Flag, FlagDto> {
  constructor(
    @InjectModel(Flag.name) private readonly flagModel: Model<FlagDocument>,
  ) {
    super(flagModel, [{ path: 'appId', select: 'name' }]);
  }

  async findByNameAndAppId(
    name: string,
    appId: string,
    expanded: boolean,
  ): Promise<Flag> {
    return this.flagModel
      .findOne({ name: name, appId: new Types.ObjectId(appId) })
      .then((data) => this.populateData(data, expanded));
  }
}
