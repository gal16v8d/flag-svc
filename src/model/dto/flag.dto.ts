import { Types } from 'mongoose';

export class FlagDto {
  readonly name: string;
  readonly appId: Types.ObjectId;
  readonly value: boolean;
}
