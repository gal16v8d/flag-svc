import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { App } from './app.schema';

export type FlagDocument = Flag & Document;

@Schema()
export class Flag {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ type: Types.ObjectId, required: true, ref: 'App' })
  appId: App;
  @Prop({ required: true })
  value: boolean;
}

export const FlagSchema = SchemaFactory.createForClass(Flag);
