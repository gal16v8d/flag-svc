import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppDbControlller } from '../controller/appdb.controller';
import { App, AppSchema } from '../model/schema/app.schema';
import { AppDbService } from '../service/appdb.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: App.name, schema: AppSchema }])],
  controllers: [AppDbControlller],
  providers: [AppDbService],
})
export class AppDbModule {}
