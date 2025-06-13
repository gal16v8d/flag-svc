import { FlagDto } from '@app/model/dto/flag.dto';
import { Flag, FlagDocument } from '@app/model/schema/flag.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GenericService } from './generic.service';

@Injectable()
export class FlagService extends GenericService<Flag, FlagDto> {
  constructor(@InjectModel(Flag.name) readonly flagModel: Model<FlagDocument>) {
    super(flagModel, [{ path: 'appId', select: 'name' }]);
  }

  async findByNameAndAppId(
    name: string,
    appId: string,
    expanded: boolean,
  ): Promise<Flag> {
    const data = await this.flagModel.findOne({
      name: name,
      appId: new Types.ObjectId(appId),
    });
    if (expanded) {
      return this.expandData(data);
    }
    return data;
  }
}
