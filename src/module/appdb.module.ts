import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppDbController } from '../controller/appdb.controller';
import { App, AppSchema } from '../model/schema/app.schema';
import { AppDbService } from '../service/appdb.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: App.name, schema: AppSchema }])],
  controllers: [AppDbController],
  providers: [AppDbService],
})
export class AppDbModule {}
