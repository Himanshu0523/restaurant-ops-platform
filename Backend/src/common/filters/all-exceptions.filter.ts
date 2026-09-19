import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../constants/error-codes.js';
import { APP_CONSTANTS } from '../constants/app.constansts.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, errorCode, error } = this.extract(exception, status);

    const requestId =
      (request.headers[APP_CONSTANTS.REQUEST_ID_HEADER] as string) ?? null;

    const body = {
      success: false,
      statusCode: status,
      errorCode,
      message,
      error,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      requestId,
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} -> ${status} ${message}`,
      );
    }

    response.status(status).json(body);
  }

  private extract(
    exception: unknown,
    status: number,
  ): { message: string; errorCode: ErrorCode; error: string } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const error = exception.name;

      if (typeof res === 'string') {
        return { message: res, errorCode: this.map(status), error };
      }

      if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;
        const rawMessage = r.message;
        const message = Array.isArray(rawMessage)
          ? rawMessage.join(', ')
          : typeof rawMessage === 'string'
            ? rawMessage
            : exception.message;
        const errorCode =
          (r.errorCode as ErrorCode) ?? this.map(status);
        const errorName = (r.error as string) ?? error;
        return { message, errorCode, error: errorName };
      }
    }

    if (exception instanceof Error) {
      return {
        message: exception.message,
        errorCode: this.map(status),
        error: 'Internal Server Error',
      };
    }

    return {
      message: 'Internal server error',
      errorCode: ErrorCode.INTERNAL_ERROR,
      error: 'Internal Server Error',
    };
  }

  private map(status: number): ErrorCode {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.VALIDATION_FAILED;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      default:
        return status >= 500 ? ErrorCode.INTERNAL_ERROR : ErrorCode.VALIDATION_FAILED;
    }
  }
}