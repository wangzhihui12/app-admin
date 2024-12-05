import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { LogFieldTypes } from '../common/enums'

export class CreateFieldDto {
  @ApiProperty({
    description: '字段名称',
    required: true
  })
  @IsNotEmpty({ message: '字段名称不能为空' })
  name: string
  @ApiProperty({
    description: '字段类型,枚举,目前只有"user"',
    required: true
  })
  @IsEnum(LogFieldTypes, { message: '字段类型错误,目前只有user' })
  @IsNotEmpty({ message: '字段类型不能为空' })
  type: LogFieldTypes
}

export class QueryFieldDto extends PartialType(CreateFieldDto) {}
