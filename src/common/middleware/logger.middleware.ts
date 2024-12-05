import { Injectable, NestMiddleware, Logger, RequestMethod } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
// import { Logger } from '../../logger/log4js';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, url, originalUrl, baseUrl, query, body } = req
    Logger.warn({ method, url, originalUrl, baseUrl, query, body })
    next()
  }
}
