import { appArray, mockApp1 } from '@app/__mocks__/appdb.mock';
import { App } from '@app/model/schema/app.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AppDbService } from './appdb.service';

const APP_ID = '1';

describe('AppDbService test suite', () => {
  let service: AppDbService;
  let model: Model<App>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppDbService,
        {
          provide: getModelToken('App'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockApp1),
            constructor: jest.fn().mockResolvedValue(mockApp1),
            create: jest.fn().mockResolvedValue(mockApp1),
            find: jest.fn().mockResolvedValue(appArray),
            findOne: jest.fn().mockResolvedValue(mockApp1),
            findByIdAndUpdate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValueOnce(mockApp1),
            } as any),
            findByIdAndDelete: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValueOnce(mockApp1),
            } as any),
            exec: jest.fn(),
          },
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
    const newApp = await service.create({
      name: mockApp1.name,
    });
    expect(newApp).toEqual(mockApp1);
    expect(model.create).toHaveBeenCalled();
  });

  it('should return all apps', async () => {
    const apps = await service.findAll(false);
    expect(apps).toEqual(appArray);
    expect(model.find).toHaveBeenCalled();
  });

  it('should return single app', async () => {
    const app = await service.findOne(APP_ID, false);
    expect(app).toEqual(mockApp1);
    expect(model.findOne).toHaveBeenCalled();
  });

  it('should return app by name', async () => {
    const app = await service.findByName(APP_ID, false);
    expect(app).toEqual(mockApp1);
    expect(model.findOne).toHaveBeenCalled();
  });

  it('should update an app', async () => {
    const app = await service.update(APP_ID, { name: appArray[1].name });
    expect(app).toEqual(mockApp1);
    expect(model.findByIdAndUpdate).toHaveBeenCalled();
  });

  it('should delete an app', async () => {
    await service.delete(APP_ID);
    expect(model.findByIdAndDelete).toHaveBeenCalled();
  });
});
