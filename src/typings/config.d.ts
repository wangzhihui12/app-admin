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

declare namespace ConfigTypes {
  interface ILogConfig extends CommonTypes.IDeviceId, CommonTypes.ITime {
    log_saved_days: number
    // fields: DeviceTypes.IFields[]
  }
  type LogConfigQuery = Pick<Partial<ILogConfig>, 'device_id'> & CommonTypes.IQueryBase
  type LogConfigResult = Partial<ILogConfig>
  type LogConfigUpdate = CommonTypes.Optional<ILogConfig, 'device_id'>
}
