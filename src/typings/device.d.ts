declare namespace DeviceTypes {
  type IQueryDevices = Partial<CommonTypes.IQueryBase & CommonTypes.ISn & CommonTypes.IUser & Pick<DeviceStatus.Status, 'status'>>

  type TDeviceInfo = CommonTypes.ITime & Partial<CommonTypes.IUser>

  type TOneDeviceInfo = TDeviceInfo & CommonTypes.IDeviceId

  interface IDevice extends CommonTypes.IId, CommonTypes.ISn, DeviceStatus.Status, Partial<TDeviceInfo>, Partial<ConfigTypes.ILogConfig> {
    fields: FieldTypes.TFieldRequird[]
  }

  interface IDeviceResult extends CommonTypes.IId, CommonTypes.ISn, Partial<Pick<CommonTypes.ITime, 'created_at'>> {
    device_info: Partial<TDeviceInfo>
    log_config: Partial<ConfigTypes.ILogConfig>
    device_status: DeviceStatus.Status
    fields: IFields[]
  }
  interface IDeviceSaves extends CommonTypes.IDeviceId, Partial<CommonTypes.ISn> {
    device_info?: Partial<TDeviceInfo>
    log_config?: Partial<ConfigTypes.ILogConfig>
    user_fields?: Array<Number>
  }
  interface IFields {
    field?: FieldTypes.TFieldRequird
  }

  type TRemoveLogsResultByTask = (CommonTypes.IDeviceId & Pick<ConfigTypes.ILogConfig, 'log_saved_days'>)
}
