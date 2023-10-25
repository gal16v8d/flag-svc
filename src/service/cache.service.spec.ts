import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { CacheService } from './cache.service';

const APP_ID = '1';
const KEY = 'key';

describe('CacheService test suite', () => {
  let service: CacheService;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockResolvedValue(APP_ID),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cache = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get data from cache', async () => {
    const data = await service.get(KEY);
    expect(data).toEqual(APP_ID);
  });

  it('should set data in cache', async () => {
    await service.set(KEY, APP_ID);
    expect(cache.set).toHaveBeenCalled();
  });

  it('should delete data from cache', async () => {
    await service.delete(KEY);
    expect(cache.del).toHaveBeenCalled();
  });

  it('should deleteAll data from cache', async () => {
    await service.set(KEY, APP_ID);
    await service.deleteAll(KEY);
    expect(cache.del).toHaveBeenCalled();
  });

  it('should getCacheKeys', async () => {
    await service.set(KEY, APP_ID);
    const data = await service.getCacheKeys();
    expect(data).toHaveLength(1);
  });
});
