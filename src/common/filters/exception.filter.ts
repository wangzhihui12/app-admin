import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Response, Request } from 'express'
import { BodyResponse } from '../utils'

// @Catch() 装饰器绑定所需的元数据到异常过滤器上。它告诉 Nest这个特定的过滤器正在寻找
@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp()
    // 获取响应体
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    Logger.error(exception)
    // console.log(exception)
    // 获取状态码，判断是HTTP异常还是服务器异常
    const code = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception.meta?.cause || exception.message || '服务器异常'
    // 自定义异常返回体
    response.status(code).json(BodyResponse({ message, code, error: exception, url: request.url }))
  }
}
