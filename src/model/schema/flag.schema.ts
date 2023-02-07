import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { App } from './app.schema';

@Schema()
export class Flag {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ type: Types.ObjectId, required: true, ref: App.name })
  appId: App;
  @Prop({ required: true })
  value: boolean;
}

export type FlagDocument = Flag & Document;
export const FlagSchema = SchemaFactory.createForClass(Flag);
