import {  IsNumber, IsNotEmpty, ValidateIf, IsInt, Matches, isString, IsEnum, IsDefined, isEnum, IsOptional,  } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { DocTypes } from '../common/enums'
import { BaseDto } from './base.dto'

export class FileQueryDto extends BaseDto {
  @ApiProperty({
    type: String,
    description: '文件名称',
    required: false,
    default: ''
  }) 
  filename?: string

  @ApiProperty({
    type: String,
    description: '文件类型',
    required: false,
    default: ''
  })
  @IsOptional()  // 允许为空  
  @IsEnum(DocTypes) // 非空时必须为 DocTypes 枚举中的一个值  
  type?: DocTypes
}
export class FileDeleteDto {

  @ApiProperty({
    type: Number,
    description: '文件记录表主键Id',
    default: 0
  })
  @Transform(({ value }) => (isString(value) && !isNaN(Number(value)) ? value : undefined), {
    toClassOnly: true,
  })
  @Matches(/[0-9]+$/, { message: 'id must be a numeric string' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: number | string

}