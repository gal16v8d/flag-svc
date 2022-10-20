import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlagController } from '../controller/flag.controller';
import { Flag, FlagSchema } from '../model/schema/flag.schema';
import { FlagService } from '../service/flag.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Flag.name, schema: FlagSchema }]),
  ],
  controllers: [FlagController],
  providers: [FlagService],
})
export class FlagModule {}
