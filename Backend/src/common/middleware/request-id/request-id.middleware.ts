import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request , Response , NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { APP_CONSTANTS } from '../../constants/app.constansts.js';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incoming = req.headers[APP_CONSTANTS.REQUEST_ID_HEADER];
    const requestId =
      typeof incoming === 'string' && incoming.length > 0
        ? incoming
        : randomUUID();

    req.headers[APP_CONSTANTS.REQUEST_ID_HEADER] = requestId;
    res.setHeader(APP_CONSTANTS.REQUEST_ID_HEADER, requestId);
    next();
  }
}