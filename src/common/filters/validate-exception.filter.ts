import { ArgumentsHost, Catch, ExceptionFilter,HttpStatus, Logger } from '@nestjs/common'
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express'
import { BodyResponse } from '../utils'
@Catch(ValidationError)
export class ValidateExceptionFilter implements ExceptionFilter<ValidationError> {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.BAD_REQUEST;
    Logger.error(exception)
    // response
    //   .status(status)
    //   .json({
    //     statusCode: status,
    //     // message: exception.message,
    //   });
    // // 自定义异常返回体
    // response.status(status).json(BodyResponse(null, message, status, request.url))
  }
}
