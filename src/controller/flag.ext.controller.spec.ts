import { mockFlag1 } from '@app/__mocks__/flag.mock';
import config from '@app/config/config';
import { CacheService } from '@app/service/cache.service';
import { FlagService } from '@app/service/flag.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FlagExtController } from './flag.ext.controller';

const APP_ID = '1';

describe('FlagExt Controller test suite', () => {
  let controller: FlagExtController;
  let service: FlagService;
  let cache: CacheService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [config] })],
      controllers: [FlagExtController],
      providers: [
        {
          provide: FlagService,
          useValue: {
            findByNameAndAppId: jest.fn().mockResolvedValue(mockFlag1),
            getKey: jest.fn().mockResolvedValue('Flag'),
          },
        },
        {
          provide: CacheService,
          useValue: {
            set: jest.fn(),
            get: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = app.get<FlagExtController>(FlagExtController);
    service = app.get<FlagService>(FlagService);
    cache = app.get<CacheService>(CacheService);
  });

  it('should return flag by name and id (not cached)', async () => {
    const app = await controller.findByNameAndAppId(APP_ID, '1', false);
    expect(app).toEqual(mockFlag1);
    expect(cache.get).toHaveBeenCalled();
    expect(service.findByNameAndAppId).toHaveBeenCalled();
    expect(cache.set).toHaveBeenCalled();
  });

  it('should return flag by name and id (cached)', async () => {
    const mockCacheGet = jest.spyOn(cache, 'get').mockResolvedValue(mockFlag1);
    const app = await controller.findByNameAndAppId(APP_ID, '1', false);
    expect(app).toEqual(mockFlag1);
    expect(mockCacheGet).toHaveBeenCalled();
    expect(service.findByNameAndAppId).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });
});
