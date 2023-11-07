import config from '@app/config/config';
import { AppDbController } from '@app/controller/appdb.controller';
import { App, AppSchema } from '@app/model/schema/app.schema';
import { AppDbService } from '@app/service/appdb.service';
import { CacheService } from '@app/service/cache.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    MongooseModule.forFeature([{ name: App.name, schema: AppSchema }]),
  ],
  controllers: [AppDbController],
  providers: [AppDbService, CacheService],
})
export class AppDbModule {}
