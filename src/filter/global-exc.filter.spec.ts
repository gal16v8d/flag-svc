import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import { ArgumentsHost, HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { GlobalExceptionFilter } from './global-exc.filter';

describe('GlobalExceptionFIlter', () => {
  const mockLogger = { error: jest.fn() };

  let excFilter: GlobalExceptionFilter;
  let mockJson: unknown;
  let mockStatus: unknown;
  let mockHttpArgs: HttpArgumentsHost;
  let mockArgHost: ArgumentsHost;

  beforeEach(async () => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockImplementation(() => ({ json: mockJson }));

    mockHttpArgs = {
      getResponse: () => ({
        status: mockStatus,
        json: mockJson,
      }),
      getRequest: () => ({
        url: 'test-url',
        header: (header: string) => header,
      }),
      getNext: () => jest.fn(),
    } as HttpArgumentsHost;
    mockArgHost = {
      switchToHttp: () => mockHttpArgs,
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalExceptionFilter,
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();
    excFilter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);
  });

  it('should be defined', () => {
    expect(excFilter).toBeDefined();
  });

  it('should log and filter the httpexception', () => {
    excFilter.catch(
      new BadRequestException('Missing required header x-api-key'),
      mockArgHost,
    );
    expect(mockJson).toHaveBeenCalledWith({
      status: HttpStatus.BAD_REQUEST,
      path: 'test-url',
      message: 'Missing required header x-api-key',
    });
  });

  it('should log and filter the custom exception', () => {
    excFilter.catch(new TypeError('Custom error'), mockArgHost);
    expect(mockJson).toHaveBeenCalledWith({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      path: 'test-url',
      message: 'Internal server error',
    });
  });
});
