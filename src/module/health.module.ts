import { Module } from '@nestjs/common';
import { HealthController } from '../controller/health.controller';
import { HealthService } from '../service/health.service';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
