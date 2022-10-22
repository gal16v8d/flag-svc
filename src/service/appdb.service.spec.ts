import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { App } from '../model/schema/app.schema';
import { AppDbService } from './appdb.service';
import { appArray, mockApp1 } from '../__mocks__/appdb.mock';

const APP_ID = '1';

describe('AppDbService test suite', () => {
  const mockModel = {
    new: jest.fn().mockResolvedValue(mockApp1),
    constructor: jest.fn().mockResolvedValue(mockApp1),
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
    exec: jest.fn(),
  };
  let service: AppDbService;
  let model: Model<App>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppDbService,
        {
          provide: getModelToken('App'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<AppDbService>(AppDbService);
    model = module.get<Model<App>>(getModelToken('App'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a new app', async () => {
    jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockApp1));
    const newApp = await service.create({
      name: mockApp1.name,
    });
    expect(newApp).toEqual(mockApp1);
  });

  it('should return all apps', async () => {
    jest.spyOn(model, 'find').mockResolvedValue(appArray);
    const apps = await service.findAll(false);
    expect(apps).toEqual(appArray);
  });

  it('should return single app', async () => {
    jest.spyOn(model, 'findOne').mockResolvedValue(mockApp1);
    const app = await service.findOne(APP_ID, false);
    expect(app).toEqual(mockApp1);
  });

  it('should return app by name', async () => {
    jest.spyOn(model, 'findOne').mockResolvedValue(mockApp1);
    const app = await service.findByName(APP_ID, false);
    expect(app).toEqual(mockApp1);
  });

  it('should update an app', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockApp1),
    } as any);
    const app = await service.update(APP_ID, { name: appArray[1].name });
    expect(app).toEqual(mockApp1);
  });

  it('should delete an app', async () => {
    jest.spyOn(model, 'findByIdAndRemove').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockApp1),
    } as any);
    const app = await service.delete(APP_ID);
    expect(app).toEqual(mockApp1);
  });
});
