import { Test, TestingModule } from '@nestjs/testing';
import { FlagController } from '../controller/flag.controller';
import { FlagService } from '../service/flag.service';
import { flagArray, mockFlag1 } from '../__mocks__/flag.mock';

const APP_ID = '1';

describe('Appdb Controller test suite', () => {
  let flagController: FlagController;
  let service: FlagService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FlagController],
      providers: [
        {
          provide: FlagService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockFlag1),
            findAll: jest.fn().mockResolvedValue(flagArray),
            findOne: jest.fn().mockResolvedValue(mockFlag1),
            findByName: jest.fn().mockResolvedValue(mockFlag1),
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
    const createSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValueOnce(mockFlag1);
    const payload = {
      name: mockFlag1.name,
      appId: mockFlag1.appId,
      value: mockFlag1.value,
    };
    await flagController.create(payload);
    expect(createSpy).toHaveBeenCalledWith(payload);
  });

  it('should return all flags', async () => {
    const apps = await service.findAll(false);
    expect(apps).toEqual(flagArray);
  });

  it('should return single flag', async () => {
    const app = await flagController.findOne(APP_ID, false);
    expect(app).toEqual(mockFlag1);
  });

  it('should return flag by name', async () => {
    const app = await flagController.findByName(APP_ID, false);
    expect(app).toEqual(mockFlag1);
  });
});
