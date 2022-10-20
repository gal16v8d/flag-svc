import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppDocument = App & Document;

@Schema()
export class App {
  @Prop({ required: true, unique: true })
  name: string;
}

export const AppSchema = SchemaFactory.createForClass(App);
