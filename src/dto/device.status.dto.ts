import { IsString, IsNumber, IsNotEmpty, MaxLength, IsMobilePhone, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeviceStatusDto  {
  @ApiProperty({
    type: Number,
    description: '设备ID',
    required: true,
  })
  @IsNumber({}, { message: '设备ID必须是数字' })
  @IsNotEmpty({ message: '设备ID不能为空' })
  device_id: number

  @ApiProperty({
    type: Number,
    description: '设备状态',
    required: false,
  })
  status?: number

  @ApiProperty({
    type: String,
    description: '最后一次上传日志的时间',
    required: false,
  })
  last_log_upload_time?: string

  @ApiProperty({
    type: String,
    description: '最后一次移除日志的时间',
    required: false,
  })
  last_log_remove_time?: string

  @ApiProperty({
    type: String,
    description: '最后一次登录时间',
    required: false,
  })
  last_login_time?: string

  @ApiProperty({
    type: String,
    description: '最后一次离线时间',
    required: false,
  })
  last_offline_time?: string
}
