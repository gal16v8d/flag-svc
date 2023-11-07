import config from '@app/config/config';
import { FlagController } from '@app/controller/flag.controller';
import { FlagExtController } from '@app/controller/flag.ext.controller';
import { Flag, FlagSchema } from '@app/model/schema/flag.schema';
import { CacheService } from '@app/service/cache.service';
import { FlagService } from '@app/service/flag.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    MongooseModule.forFeature([{ name: Flag.name, schema: FlagSchema }]),
  ],
  controllers: [FlagController, FlagExtController],
  providers: [FlagService, CacheService],
})
export class FlagModule {}
