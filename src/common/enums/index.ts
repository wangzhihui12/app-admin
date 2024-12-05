/**
 * @description: 响应码
 */
export enum RESPONSE_CODE {
  NOSUCCESS = -1, // 表示请求成功，但操作未成功
  SUCCESS = 200, // 请求成功
  BAD_REQUEST = 400, // 请求错误
  UNAUTHORIZED = 401, // 未授权
  FORBIDDEN = 403, // 禁止访问
  NOT_FOUND = 404, // 资源未找到
  INTERNAL_SERVER_ERROR = 500 // 服务器错误
}

/**
 * @description: 请求提示语
 */
export enum RESPONSE_MSG {
  SUCCESS = '请求成功',
  FAILURE = '请求失败'
}

export enum WsMessageType {
  /**
   * 私有订阅
   */
  Private = 'private',
  /**
   * 系统订阅
   */
  System = 'system'
}

export enum WsStatus {
  Disuse = 0,
  Online = 1,
  Offline = 2
}

export enum WsAccess {
  NotAllowed = '无访问权限',
  InValidToken = '无效token',
  InvalidDeviceId = '无效设备id',
  IsOnline = '通过验证,设备上线',
  IsOffline = '设备下线',
  ConnFailure = '设备连接失败,请检查设备号是否正确',
  TokenExpired = 'token已过期,请重新登录'
}
export enum WsAccessCode {
  NotAllowed = 901,
  InValidToken = 902,
  InvalidDeviceId = 903,
  IsOnline = 904,
  IsOffline = 905,
  ConnFailure = 906,
  TokenExpired = 907
}

export enum Events {
  OnConnected = 'device.connected',
  OnConnectError = 'device.connect.error',
  OnOfflineAll = 'device.offline.all',
  OnMessage = 'client.mesage.received',
  OnLogFileUploaded = 'log.file.uploaded',
  OnLogFileRemoved = 'log.file.removed',
  OnDailyTaskStart = 'task.daily.start',
  OnSendMessage = 'client.message.send',
  OnMessageToSendClient = 'message.send.to.client'
}
export enum DocTypes {
  Log = 'log',
  Image = 'image',
  Video = 'video',
  Other = 'other'
}
export enum Command {
  GetLog = 'getLog',
  GetStorage = 'getStorage',
  Message = 'message',
  GetLogList = 'getLogList',
  RemoveLog = 'removeLog',
  RemoveRecord = 'removeRecord',
  StopPolling = 'stopPolling',
  StartPolling = 'startPolling',
  SetPollingInterval = 'setPollingInterval'
}

export enum LogFieldTypes {
  User = 'user'
}
