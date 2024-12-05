import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { BodyResponse } from '../utils'
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    Logger.error(exception)
    // console.log(exception)
    const exceptionRes: any = exception.getResponse()
    const { message } = exceptionRes

    // response.status(status).json({
    //   status,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    //   error,
    //   message,
    // });
    // 自定义异常返回体
    response.status(status).json(BodyResponse({message, code:status,error:exception, url:request.url}))
  }
}
