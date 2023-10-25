import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Injectable()
export class RequestMiddleware implements NestMiddleware<Request, Response> {
  private readonly logger = new Logger(RequestMiddleware.name);

  public use(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: (error?: any) => void,
  ) {
    const startTime = Date.now();

    this.logger.debug('incoming request', {
      http_method: req.method,
      http_version: req.httpVersion,
      ip: req.ip,
      url: req.originalUrl,
    });

    next();

    res.on('close', () => {
      const endTime = Date.now() - startTime;
      this.logger.debug('request completed', {
        duration: endTime,
        http_method: req.method,
        http_status: res.statusCode,
        http_version: req.httpVersion,
        ip: req.ip,
        url: req.originalUrl,
      });
    });
  }
}
