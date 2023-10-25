import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { flagArray, mockFlag1 } from '../__mocks__/flag.mock';
import config from '../config/config';
import { CacheService } from '../service/cache.service';
import { FlagService } from '../service/flag.service';
import { FlagController } from './flag.controller';

const APP_ID = '1';

describe('Flag Controller test suite', () => {
  let flagController: FlagController;
  let service: FlagService;
  let cache: CacheService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [config] })],
      controllers: [FlagController],
      providers: [
        {
          provide: FlagService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockFlag1),
            findAll: jest.fn().mockResolvedValue(flagArray),
            findByName: jest.fn().mockResolvedValue(mockFlag1),
            findOne: jest.fn().mockResolvedValue(mockFlag1),
            findByNameAndAppId: jest.fn().mockResolvedValue(mockFlag1),
            update: jest.fn().mockResolvedValue(mockFlag1),
            delete: jest.fn().mockResolvedValue(mockFlag1),
            getKey: jest.fn().mockResolvedValue('Flag'),
          },
        },
        {
          provide: CacheService,
          useValue: {
            set: jest.fn(),
            get: jest.fn().mockResolvedValue(undefined),
            deleteAll: jest.fn(),
          },
        },
      ],
    }).compile();

    flagController = app.get<FlagController>(FlagController);
    service = app.get<FlagService>(FlagService);
    cache = app.get<CacheService>(CacheService);
  });

  it('should create a new flag', async () => {
    const payload = {
      name: mockFlag1.name,
      appId: mockFlag1.appId,
      value: mockFlag1.value,
    };
    await flagController.create(payload);
    expect(service.create).toHaveBeenCalledWith(payload);
    expect(cache.deleteAll).toHaveBeenCalled();
  });

  it('should return all flags (not cached)', async () => {
    const apps = await flagController.find(false);
    expect(apps).toEqual(flagArray);
    expect(cache.get).toHaveBeenCalled();
    expect(service.findAll).toHaveBeenCalled();
    expect(cache.set).toHaveBeenCalled();
  });

  it('should return all flags (cached)', async () => {
    const mockCacheGet = jest.spyOn(cache, 'get').mockResolvedValue(flagArray);
    const apps = await flagController.find(false);
    expect(apps).toEqual(flagArray);
    expect(mockCacheGet).toHaveBeenCalled();
    expect(service.findAll).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should return flag by name (not cached)', async () => {
    const app = await flagController.find(false, APP_ID);
    expect(app).toEqual(mockFlag1);
    expect(cache.get).toHaveBeenCalled();
    expect(service.findByName).toHaveBeenCalled();
    expect(cache.set).toHaveBeenCalled();
  });

  it('should return flag by name (cached)', async () => {
    const mockCacheGet = jest.spyOn(cache, 'get').mockResolvedValue(mockFlag1);
    const app = await flagController.find(false, APP_ID);
    expect(app).toEqual(mockFlag1);
    expect(mockCacheGet).toHaveBeenCalled();
    expect(service.findByName).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should return single flag (not cached)', async () => {
    const app = await flagController.findOne(APP_ID, false);
    expect(app).toEqual(mockFlag1);
    expect(cache.get).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalled();
    expect(cache.set).toHaveBeenCalled();
  });

  it('should return single flag (cached)', async () => {
    const mockCacheGet = jest.spyOn(cache, 'get').mockResolvedValue(mockFlag1);
    const app = await flagController.findOne(APP_ID, false);
    expect(app).toEqual(mockFlag1);
    expect(mockCacheGet).toHaveBeenCalled();
    expect(service.findOne).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should call update service', async () => {
    const app = await flagController.update(APP_ID, mockFlag1);
    expect(app).toEqual(mockFlag1);
    expect(service.update).toHaveBeenCalledWith(APP_ID, mockFlag1);
    expect(cache.deleteAll).toHaveBeenCalled();
  });

  it('should call delete service', async () => {
    const app = await flagController.delete(APP_ID);
    expect(app).toEqual(mockFlag1);
    expect(service.delete).toHaveBeenCalledWith(APP_ID);
    expect(cache.deleteAll).toHaveBeenCalled();
  });
});
