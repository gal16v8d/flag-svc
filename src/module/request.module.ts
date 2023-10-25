import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestMiddleware } from '../middleware/request.middleware';

@Global()
@Module({})
export class RequestModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
