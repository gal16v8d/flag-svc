import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import config from '../config/config';
import { AppDbController } from '../controller/appdb.controller';
import { AppDbService } from '../service/appdb.service';
import { appArray, mockApp1 } from '../__mocks__/appdb.mock';

const APP_ID = '1';

describe('Appdb Controller test suite', () => {
  let appDbController: AppDbController;
  let service: AppDbService;

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
          },
        },
      ],
    }).compile();

    appDbController = app.get<AppDbController>(AppDbController);
    service = app.get<AppDbService>(AppDbService);
  });

  it('should create a new app', async () => {
    const payload = {
      name: mockApp1.name,
    };
    await appDbController.create(payload);
    expect(service.create).toHaveBeenCalledWith(payload);
  });

  it('should return all apps', async () => {
    const apps = await appDbController.find(false);
    expect(apps).toEqual(appArray);
  });

  it('should return app by name', async () => {
    const app = await appDbController.find(false, APP_ID);
    expect(app).toEqual(mockApp1);
  });

  it('should return single app', async () => {
    const app = await appDbController.findOne(APP_ID, false);
    expect(app).toEqual(mockApp1);
  });

  it('should call update service', async () => {
    const app = await appDbController.update(APP_ID, mockApp1);
    expect(app).toEqual(mockApp1);
    expect(service.update).toHaveBeenCalledWith(APP_ID, mockApp1);
  });

  it('should call delete service', async () => {
    const app = await appDbController.delete(APP_ID);
    expect(app).toEqual(mockApp1);
    expect(service.delete).toHaveBeenCalledWith(APP_ID);
  });
});
