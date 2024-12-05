import { IsString, IsNumber, IsNotEmpty, MaxLength, IsMobilePhone, IsOptional, isNotEmpty } from 'class-validator'
import { ApiProperty, IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { BaseDto, DeviceIdDto, SnDto, TimeDto, UserBaseDto } from './base.dto'
import { LogConfigUpdateDto } from './config.dto'

export class DeviceQueryDto extends PartialType(UserBaseDto) {
  @ApiProperty({
    type: Number,
    description: '在线状态 1:在线,2:离线,0:弃用',
    required: false
  })
  status?: number
}

export class DeviceFindOneDto extends PickType(UserBaseDto, ['user', 'mobile']) {}

export class AddDeviceInfoDto extends IntersectionType(PartialType(SnDto),TimeDto) {
  
  @ApiProperty({
    description: '设备信息 包括 user mobile merchant_name'
  })
  device_info?: UserBaseDto
  @ApiProperty({
    description: '设备配置信息 包括 log_saved_days'
  })
  log_config?: LogConfigUpdateDto

  @ApiProperty({
    description: '设备对应的日志字段集合 '
  })
  user_fields?: Array<Number>
}

export class UpdateDeviceInfoDto extends IntersectionType(PartialType(AddDeviceInfoDto), DeviceIdDto) {}
