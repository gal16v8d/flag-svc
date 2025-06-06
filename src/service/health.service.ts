import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHello(): Record<string, string> {
    return { status: 'UP' };
  }
}
