import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Flag } from '../model/schema/flag.schema';
import { flagArray, mockFlag1 } from '../__mocks__/flag.mock';
import { FlagService } from './flag.service';

const FLAG_ID = '1';

describe('FlagService test suite', () => {
  const mockModel = {
    new: jest.fn().mockResolvedValue(mockFlag1),
    constructor: jest.fn().mockResolvedValue(mockFlag1),
    create: jest.fn().mockResolvedValue(mockFlag1),
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
    exec: jest.fn(),
  };
  let service: FlagService;
  let model: Model<Flag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagService,
        {
          provide: getModelToken('Flag'),
          useValue: mockModel,
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
  });

  it('should return all flags', async () => {
    jest.spyOn(model, 'find').mockResolvedValue(flagArray);
    const flags = await service.findAll(false);
    expect(flags).toEqual(flagArray);
  });

  it('should return single flag', async () => {
    jest.spyOn(model, 'findOne').mockResolvedValue(mockFlag1);
    const flag = await service.findOne(FLAG_ID, false);
    expect(flag).toEqual(mockFlag1);
  });

  it('should return flag by name', async () => {
    jest.spyOn(model, 'findOne').mockResolvedValue(mockFlag1);
    const flag = await service.findByName(FLAG_ID, false);
    expect(flag).toEqual(mockFlag1);
  });

  it('should update a flag', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockFlag1),
    } as any);
    const flag = await service.update(FLAG_ID, flagArray[1]);
    expect(flag).toEqual(mockFlag1);
  });

  it('should delete a flag', async () => {
    jest.spyOn(model, 'findByIdAndRemove').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockFlag1),
    } as any);
    const flag = await service.delete(FLAG_ID);
    expect(flag).toEqual(mockFlag1);
  });
});
