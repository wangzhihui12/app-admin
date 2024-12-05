import { ApiProperty } from '@nestjs/swagger'

import { Command, WsMessageType } from '../common/enums'
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, registerDecorator, ValidateIf, ValidateNested, ValidationArguments, ValidationOptions } from 'class-validator'
import { Type } from 'class-transformer'
import { IsNumberOrNumberString } from './base.dto'
class DataDto {
  @ApiProperty({
    type: String,
    description: '指令类型 '
  })
  @IsEnum(Command, { message: '指令类型错误 目前支持 ' })
  @IsString({ message: '指令为必填参数' })
  @IsNotEmpty({ message: '指令不能为空' })
  readonly command: Command

  @ApiProperty({
    description: '删除日志传入的天数,非必填,但是如果有值,必须为数字,且当指令为删除日志时,days为必填'
  })
  @IsOptional()
  @IsDefined({ message: '当指令为删除日志时,days为必填' })
  @IsNumberOrNumberString()
  @ValidateIf(o => o.command === Command.RemoveLog)
  readonly days?: number | string

  @ApiProperty({
    description: '删除接待记录时,为接待记录的ID,且当指令为删除接待记录时,id为必填'
  })
  @IsOptional()
  @ValidateIf(o => o.command === Command.RemoveRecord)
  @IsDefined({ message: '当指令为删除接待记录时,id为必填' })
  readonly id?: string

  @ApiProperty({
    description: '设置文件上传轮询间隔时间时,当指令为设置文件上传轮询间隔时间时,interval为必填'
  })
  @ValidateIf(o => o.command === Command.SetPollingInterval)
  @IsDefined({ message: '当指令设置文件上传轮询间隔时间,interval为必填 且必须为数字' })
  @IsNumberOrNumberString()
  readonly interval: number | string
}
export class BroadcastDto {
  @ApiProperty({
    type: String,
    description: '事件类型: private-私有消息,system-系统消息'
  })
  @IsEnum(WsMessageType, { message: '事件类型错误' })
  @IsNotEmpty({ message: '事件类型不能为空' })
  readonly event: WsMessageType

  @ValidateIf(o => o.event === WsMessageType.Private)
  @IsDefined({ message: '发送私有消息时,device_id是必填的' })
  @ApiProperty({
    type: Number,
    description: '设备号,私发信息必填'
  })
  readonly device_id: number

  @IsNotEmpty({ message: '消息不能为空' })
  @ApiProperty({ description: '要发送的数据' })
  @ValidateNested()
  @Type(() => DataDto)
  readonly data: any
}
