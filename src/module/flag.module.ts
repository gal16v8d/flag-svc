import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config/config';
import { FlagController } from '../controller/flag.controller';
import { FlagExtController } from '../controller/flag.ext.controller';
import { Flag, FlagSchema } from '../model/schema/flag.schema';
import { CacheService } from '../service/cache.service';
import { FlagService } from '../service/flag.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    MongooseModule.forFeature([{ name: Flag.name, schema: FlagSchema }]),
  ],
  controllers: [FlagController, FlagExtController],
  providers: [FlagService, CacheService],
})
export class FlagModule {}
