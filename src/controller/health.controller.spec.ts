import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../controller/health.controller';
import { HealthService } from '../service/health.service';

describe('Health Controller test suite', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  it('should return "UP"', () => {
    expect(healthController.getHello()).toBe('Flag-service is UP');
  });
});
