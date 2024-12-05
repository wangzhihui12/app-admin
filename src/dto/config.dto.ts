import { ApiProperty, IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, isString, Matches } from 'class-validator'
import { DeviceIdDto, TimeDto } from './base.dto'

/*
model log_config {
  id             Int                             @id @default(autoincrement())
  device_id      Int                             @unique(map: "device_id") @default(0)
  log_saved_days Int?                            @default(7) @db.TinyInt
  created_at     DateTime                        @default(now()) @db.Timestamp(0)
  updated_at     DateTime                        @default(now()) @db.Timestamp(0)
  device         device                          @relation(fields: [device_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "FK_log_config_device")
  device_info    device_info                     @relation(fields: [device_id], references: [device_id], onDelete: NoAction, onUpdate: NoAction, map: "FK_log_config_device_info")
  user_fields    log_config_userfield_relation[]
}*/
export class LogConfigDto extends IntersectionType(DeviceIdDto, PartialType(TimeDto)) {
  @ApiProperty({
    type: Number,
    description: '日志保存天数',
    required: false,
    default: ''
  })
  log_saved_days?: number
}
export class LogConfigUpdateDto extends PickType(LogConfigDto, ['log_saved_days']) {}
