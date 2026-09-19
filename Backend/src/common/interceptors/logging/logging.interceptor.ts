import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { APP_CONSTANTS } from '../../constants/app.constansts.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const start = performance.now();
        const { method, url } = request;
        const requestId =
        (request.headers[APP_CONSTANTS.REQUEST_ID_HEADER] as string) ?? '-';

      return next.handle().pipe(
        tap({
          next: () => {
              const ms = (performance.now() - start).toFixed(0);
              this.logger.log(
                `${method} ${url} ${response.statusCode} ${ms}ms req=${requestId}`,
              );
          },
            error: (err: Error & { status?: number }) => {
                const ms = (performance.now() - start).toFixed(0);
                const status = err.status ?? 500;
                const line = `${method} ${url} ${status} ${ms}ms req=${requestId}`;
                if (status >= 500) this.logger.error(line);
                else this.logger.warn(line);
            },
        }),
      );
    }
}