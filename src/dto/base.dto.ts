import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsMobilePhone, IsOptional, isString, Matches, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
// 自定义验证装饰器
export function IsNumberOrNumberString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNumberOrNumberString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // 如果值为空（null, undefined, ''），则验证通过
          if (value === '') return false
          if (value === null || value === undefined) {
            return true
          }
          // 尝试将值转换为数字，如果转换成功或原本就是数字，则验证通过
          // 注意：这里使用了 Number.isNaN 来检查转换结果是否为 NaN，从而排除非数字字符串
          return !Number.isNaN(Number(value))
        },

        defaultMessage(args: ValidationArguments): string {
          // 这里可以返回自定义的错误消息
          return `${args.property} must be a number or a numeric string`
        }
      }
    })
  }
}
export class BaseDto {
  @ApiProperty({
    type: Number,
    description: '设备ID',
    required: false,
    default: 0
  })
  @IsOptional()
  @IsNumberOrNumberString()
  device_id?: number
  @ApiProperty({
    type: Number,
    description: '每页显示的条数',
    required: false,
    default: 10
  })
  @IsOptional()
  @IsNumberOrNumberString()
  pageSize?: number

  @ApiProperty({
    type: Number,
    description: '当前页码',
    required: false,
    default: 1
  })
  @IsOptional()
  @IsNumberOrNumberString()
  pageIndex?: number
}

export class TimeDto {
  @ApiProperty({
    type: Number,
    description: '创建时间',
    default: ''
  })
  created_at: Date

  @ApiProperty({
    type: Date,
    description: '更新时间',
    default: ''
  })
  updated_at: Date
}

export class UserBaseDto {
  @ApiProperty({
    type: String,
    description: '设备用户',
    default: ''
  })
  user: string

  @IsMobilePhone('zh-CN', {}, { message: '手机号格式不正确' })
  @IsOptional()
  @ApiProperty({
    type: String,
    description: '使用者手机号',
    default: ''
  })
  mobile: string

  @ApiProperty({
    type: String,
    description: '使用者商户名称',
    default: ''
  })
  merchant_name: string
}

export class SnDto {
  @ApiProperty({
    type: String,
    description: '设备SN',
  })
  sn: string
}
export class DeviceIdDto {
  @ApiProperty({
    type: Number,
    description: '设备ID',
  })
  device_id: number
}