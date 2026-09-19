import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import { RequestIdMiddleware } from './middleware/request-id/request-id.middleware.js';
import { LoggingInterceptor } from './interceptors/logging/logging.interceptor.js';


@Global()
@Module({})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) : void {
        consumer.apply(RequestIdMiddleware).forRoutes('*');
    }
}