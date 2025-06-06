/* eslint-disable @typescript-eslint/unbound-method */
import { flagArray, mockFlag1 } from '@app/__mocks__/flag.mock';
import { Flag } from '@app/model/schema/flag.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { FlagService } from './flag.service';

const FLAG_ID = '1';

describe('FlagService test suite', () => {
  let service: FlagService;
  let model: Model<Flag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagService,
        {
          provide: getModelToken('Flag'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockFlag1),
            constructor: jest.fn().mockResolvedValue(mockFlag1),
            create: jest.fn().mockResolvedValue(mockFlag1),
            find: jest.fn().mockResolvedValue(flagArray),
            findOne: jest.fn().mockResolvedValue(mockFlag1),
            findByIdAndUpdate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValueOnce(mockFlag1),
            } as any),
            findByIdAndDelete: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValueOnce(mockFlag1),
            } as any),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FlagService>(FlagService);
    model = module.get<Model<Flag>>(getModelToken('Flag'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a new flag', async () => {
    const newFlag = await service.create(flagArray[0]);
    expect(newFlag).toEqual(mockFlag1);
    expect(model.create).toHaveBeenCalled();
  });

  it('should return all flags', async () => {
    const flags = await service.findAll(false);
    expect(flags).toEqual(flagArray);
    expect(model.find).toHaveBeenCalled();
  });

  it('should return single flag', async () => {
    const flag = await service.findOne(FLAG_ID, false);
    expect(flag).toEqual(mockFlag1);
    expect(model.findOne).toHaveBeenCalled();
  });

  it('should return flag by name', async () => {
    const flag = await service.findByName(FLAG_ID, false);
    expect(flag).toEqual(mockFlag1);
    expect(model.findOne).toHaveBeenCalled();
  });

  it('should update a flag', async () => {
    const flag = await service.update(FLAG_ID, flagArray[1]);
    expect(flag).toEqual(mockFlag1);
    expect(model.findByIdAndUpdate).toHaveBeenCalled();
  });

  it('should delete a flag', async () => {
    await service.delete(FLAG_ID);
    expect(model.findByIdAndDelete).toHaveBeenCalled();
  });
});
