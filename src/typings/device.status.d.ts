declare namespace DeviceStatus {
  interface IDeviceStatus extends CommonTypes.IDeviceId{
    status?: number,
    last_log_upload_time?: string | Date
    last_log_remove_time?: string | Date
    last_login_time?: string | Date
    last_offline_time?: string | Date
  }
  type Status = Omit<IDeviceStatus,'device_id'>
}
