import { Test, TestingModule } from '@nestjs/testing';
import { AppDbController } from '../controller/appdb.controller';
import { AppDbService } from '../service/appdb.service';
import { appArray, mockApp1 } from '../__mocks__/appdb.mock';

const APP_ID = '1';

describe('Appdb Controller test suite', () => {
  let appDbController: AppDbController;
  let service: AppDbService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppDbController],
      providers: [
        {
          provide: AppDbService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockApp1),
            findAll: jest.fn().mockResolvedValue(appArray),
            findOne: jest.fn().mockResolvedValue(mockApp1),
            findByName: jest.fn().mockResolvedValue(mockApp1),
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
    const createSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValueOnce(mockApp1);
    const payload = {
      name: mockApp1.name,
    };
    await appDbController.create(payload);
    expect(createSpy).toHaveBeenCalledWith(payload);
  });

  it('should return all apps', async () => {
    const apps = await service.findAll(false);
    expect(apps).toEqual(appArray);
  });

  it('should return single app', async () => {
    const app = await appDbController.findOne(APP_ID, false);
    expect(app).toEqual(mockApp1);
  });

  it('should return app by name', async () => {
    const app = await appDbController.findByName(APP_ID, false);
    expect(app).toEqual(mockApp1);
  });
});
