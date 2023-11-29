import config from '@app/config/config';
import { AppDbController } from '@app/controller/appdb.controller';
import { AppDbService } from '@app/service/appdb.service';
import { CacheService } from '@app/service/cache.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { appArray, mockApp1 } from '../__mocks__/appdb.mock';

const APP_ID = '1';

describe('Appdb Controller test suite', () => {
  let appDbController: AppDbController;
  let service: AppDbService;
  let cache: CacheService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [config] })],
      controllers: [AppDbController],
      providers: [
        {
          provide: AppDbService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockApp1),
            findAll: jest.fn().mockResolvedValue(appArray),
            findByName: jest.fn().mockResolvedValue(mockApp1),
            findOne: jest.fn().mockResolvedValue(mockApp1),
            update: jest.fn().mockResolvedValue(mockApp1),
            delete: jest.fn().mockResolvedValue(mockApp1),
            getKey: jest.fn().mockResolvedValue('App'),
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

    appDbController = app.get<AppDbController>(AppDbController);
    service = app.get<AppDbService>(AppDbService);
    cache = app.get<CacheService>(CacheService);
  });

  it('should create a new app', async () => {
    const payload = {
      name: mockApp1.name,
    };
    await appDbController.create(payload);
    expect(service.create).toHaveBeenCalledWith(payload);
    expect(cache.deleteAll).toHaveBeenCalled();
  });

  it('should return all apps (not cached)', async () => {
    const apps = await appDbController.find(false);
    expect(apps).toEqual(appArray);
    expect(cache.get).toHaveBeenCalled();
    expect(service.findAll).toHaveBeenCalled();
    expect(cache.set).toHaveBeenCalled();
  });

  it('should return all apps (cached)', async () => {
    const mockCacheGet = jest.spyOn(cache, 'get').mockResolvedValue(appArray);
    const apps = await appDbController.find(false);
    expect(apps).toEqual(appArray);
    expect(mockCacheGet).toHaveBeenCalled();
    expect(service.findAll).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should return app by name (not cached)', async () => {
    const app = await appDbController.find(false, APP_ID);
    expect(app).toEqual(mockApp1);
    expect(cache.get).toHaveBeenCalled();
    expect(service.findByName).toHaveBeenCalled();
    expect(cache.set).toHaveBeenCalled();
  });

  it('should return app by name (cached)', async () => {
    const mockCacheGet = jest.spyOn(cache, 'get').mockResolvedValue(mockApp1);
    const app = await appDbController.find(false, APP_ID);
    expect(app).toEqual(mockApp1);
    expect(mockCacheGet).toHaveBeenCalled();
    expect(service.findByName).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should return single app (not cached)', async () => {
    const app = await appDbController.findOne(APP_ID, false);
    expect(app).toEqual(mockApp1);
    expect(cache.get).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalled();
    expect(cache.set).toHaveBeenCalled();
  });

  it('should return single app (cached)', async () => {
    const mockCacheGet = jest.spyOn(cache, 'get').mockResolvedValue(mockApp1);
    const app = await appDbController.findOne(APP_ID, false);
    expect(app).toEqual(mockApp1);
    expect(mockCacheGet).toHaveBeenCalled();
    expect(service.findOne).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should call update service', async () => {
    const app = await appDbController.update(APP_ID, mockApp1);
    expect(app).toEqual(mockApp1);
    expect(service.update).toHaveBeenCalledWith(APP_ID, mockApp1);
    expect(cache.deleteAll).toHaveBeenCalled();
  });

  it('should call delete service', async () => {
    await appDbController.delete(APP_ID);
    expect(service.delete).toHaveBeenCalledWith(APP_ID);
    expect(cache.deleteAll).toHaveBeenCalled();
  });
});
