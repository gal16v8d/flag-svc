import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config/config';
import { AppDbModule } from './appdb.module';
import { FlagModule } from './flag.module';
import { HealthModule } from './health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('server.dbUrl'),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    AppDbModule,
    FlagModule,
  ],
})
export class AppModule {}
