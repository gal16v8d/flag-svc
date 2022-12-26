import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/module/app.module';

describe('FlagController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
