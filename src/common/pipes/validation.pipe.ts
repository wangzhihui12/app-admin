import { ArgumentMetadata,BadRequestException, HttpException, HttpStatus, Injectable, Logger, PipeTransform, Type } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    let errors = await validate(object)
    if (errors.length > 0) {
      if(!errors[0].constraints && errors[0].children?.length){ 
        errors = errors[0].children
      }
      const msg = Object.values(errors[0]?.constraints)[0]; // 只需要取第一个错误信息并返回即可
      Logger.error(`Validation failed: ${msg}`);
      throw new BadRequestException(`参数验证失败: ${msg}`);
      // const errObj = {}
      // errors.forEach(err => {
      //   const { property, constraints } = err
      //   errObj[property] = Object.values(constraints)
      // })
      // throw new HttpException({ message: errObj||'Request params validation failed', error: errObj }, HttpStatus.BAD_REQUEST)
    }
    return value
  }

  private toValidate(metatype: Type<any>): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find(type => metatype === type)
  }
}
