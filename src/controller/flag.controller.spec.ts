import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import config from '../config/config';
import { FlagController } from './flag.controller';
import { FlagService } from '../service/flag.service';
import { flagArray, mockFlag1 } from '../__mocks__/flag.mock';

const APP_ID = '1';

describe('Flag Controller test suite', () => {
  let flagController: FlagController;
  let service: FlagService;

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
          },
        },
      ],
    }).compile();

    flagController = app.get<FlagController>(FlagController);
    service = app.get<FlagService>(FlagService);
  });

  it('should create a new flag', async () => {
    const payload = {
      name: mockFlag1.name,
      appId: mockFlag1.appId,
      value: mockFlag1.value,
    };
    await flagController.create(payload);
    expect(service.create).toHaveBeenCalledWith(payload);
  });

  it('should return all flags', async () => {
    const apps = await flagController.find(false);
    expect(apps).toEqual(flagArray);
  });

  it('should return flag by name', async () => {
    const app = await flagController.find(false, APP_ID);
    expect(app).toEqual(mockFlag1);
  });

  it('should return single flag', async () => {
    const app = await flagController.findOne(APP_ID, false);
    expect(app).toEqual(mockFlag1);
  });

  it('should call update service', async () => {
    const app = await flagController.update(APP_ID, mockFlag1);
    expect(app).toEqual(mockFlag1);
    expect(service.update).toHaveBeenCalledWith(APP_ID, mockFlag1);
  });

  it('should call delete service', async () => {
    const app = await flagController.delete(APP_ID);
    expect(app).toEqual(mockFlag1);
    expect(service.delete).toHaveBeenCalledWith(APP_ID);
  });
});
