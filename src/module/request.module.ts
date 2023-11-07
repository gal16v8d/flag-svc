import { RequestMiddleware } from '@app/middleware/request.middleware';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Global()
@Module({})
export class RequestModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
