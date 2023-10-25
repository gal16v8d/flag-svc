import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config/config';
import { AppDbController } from '../controller/appdb.controller';
import { App, AppSchema } from '../model/schema/app.schema';
import { AppDbService } from '../service/appdb.service';
import { CacheService } from '../service/cache.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    MongooseModule.forFeature([{ name: App.name, schema: AppSchema }]),
  ],
  controllers: [AppDbController],
  providers: [AppDbService, CacheService],
})
export class AppDbModule {}
