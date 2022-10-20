import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FlagDocument = Flag & Document;

@Schema()
export class Flag {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  appId: string;
  @Prop({ required: true })
  value: boolean;
}

export const FlagSchema = SchemaFactory.createForClass(Flag);
