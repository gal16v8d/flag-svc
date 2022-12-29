import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import config from '../config/config';
import { FlagService } from '../service/flag.service';
import { flagArray, mockFlag1 } from '../__mocks__/flag.mock';
import { FlagExtController } from './flag.ext.controller';

const APP_ID = '1';

describe('FlagExt Controller test suite', () => {
  let flagController: FlagExtController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [config] })],
      controllers: [FlagExtController],
      providers: [
        {
          provide: FlagService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockFlag1),
            findAll: jest.fn().mockResolvedValue(flagArray),
            findOne: jest.fn().mockResolvedValue(mockFlag1),
            findByName: jest.fn().mockResolvedValue(mockFlag1),
            findByNameAndAppId: jest.fn().mockResolvedValue(mockFlag1),
            update: jest.fn().mockResolvedValue(mockFlag1),
            delete: jest.fn().mockResolvedValue(mockFlag1),
          },
        },
      ],
    }).compile();

    flagController = app.get<FlagExtController>(FlagExtController);
  });

  it('should return flag by name and id', async () => {
    const app = await flagController.findByNameAndAppId(APP_ID, '1', false);
    expect(app).toEqual(mockFlag1);
  });
});
