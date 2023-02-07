import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class App {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export type AppDocument = App & Document;
export const AppSchema = SchemaFactory.createForClass(App);
