import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter<Error> {
  constructor(private log: Logger) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response: Response = ctx.getResponse<Response>();

    this.log.error('Global Exc Filter', {
      message: exception.message,
      stack: exception.stack,
    });

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      const errResponse = exception.getResponse() as any;
      message = errResponse.message ?? errResponse.error;
      status = exception.getStatus();
    } else {
      message = 'Internal server error';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const errObj = {
      status,
      path: request.url,
      message,
    };

    response.status(status).json(errObj);
  }
}
