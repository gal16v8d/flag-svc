import { HeaderGuard } from '@app/guard/auth.guard';
import { AppModule } from '@app/module/app.module';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import * as request from 'supertest';

describe('FlagController (e2e)', () => {
  let app: INestApplication;

  class MockHeaderGuard implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      return !!context;
    }
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(HeaderGuard)
      .useClass(MockHeaderGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/flags (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/flags?name=TEST_FLAG&appId=634dc6a51a12a7cd6bb96c5f')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((body: Record<string, unknown>) => body.hasOwnProperty('value'));
  });
});
