import { HealthService } from '@app/service/health.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health Controller')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHello(): Record<string, string> {
    return this.healthService.getHello();
  }
}
