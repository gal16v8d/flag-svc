import { HealthController } from '@app/controller/health.controller';
import { HealthService } from '@app/service/health.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
