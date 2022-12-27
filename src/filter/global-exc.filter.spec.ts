import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GlobalExceptionFilter } from './global-exc.filter';

describe('GlobalExceptionFIlter', () => {
  const mockLogger = { error: jest.fn() };

  let excFilter: GlobalExceptionFilter;
  let mockJson: any;
  let mockStatus: any;
  let mockResponse: any;
  let mockHttpArgs: any;
  let mockArgHost: any;

  beforeEach(async () => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockImplementation(() => ({ json: mockJson }));
    mockResponse = jest.fn().mockImplementation(() => ({ status: mockStatus }));
    mockHttpArgs = jest.fn().mockImplementation(() => ({
      getResponse: mockResponse,
      getRequest: () => ({
        url: 'test-url',
        header: (header: string) => header,
      }),
    }));
    mockArgHost = {
      switchToHttp: mockHttpArgs,
      getArgByIndex: jest.fn(),
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
    expect(mockJson).toBeCalledWith({
      status: HttpStatus.BAD_REQUEST,
      path: 'test-url',
      message: 'Missing required header x-api-key',
    });
  });

  it('should log and filter the custom exception', () => {
    excFilter.catch(new TypeError('Custom error'), mockArgHost);
    expect(mockJson).toBeCalledWith({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      path: 'test-url',
      message: 'Internal server error',
    });
  });
});
