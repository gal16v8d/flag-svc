import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../module/app.module';
import { HeaderGuard } from './auth.guard';

describe('HeaderGuard test suite', () => {
  let app: INestApplication;
  let guard: HeaderGuard;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    guard = app.get<HeaderGuard>(HeaderGuard);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('guard should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('can not active bad secret header', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockImplementation(() => ({ json: mockJson }));
    const mockResponse = jest
      .fn()
      .mockImplementation(() => ({ status: mockStatus }));
    const mockHttpArgs = jest.fn().mockImplementation(() => ({
      getResponse: mockResponse,
      getRequest: () => ({
        url: 'test-url',
        headers: {
          'x-api-key': '',
        },
      }),
    }));
    const mockArgHost = {
      switchToHttp: mockHttpArgs,
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
    };
    const result = guard.canActivate(mockArgHost);
    expect(result).toBeFalsy();
  });
});
