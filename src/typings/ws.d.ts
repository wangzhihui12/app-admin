declare namespace WsTypes {
  abstract class WebSocketGateway<S, T, U> {
    server: S
    abstract subPrivate(data: any): T
    abstract subSystem(data: U): Promise<U>
  }
  type WsMsgType = 'private' | 'system'

  type MessageBody<U, T = WsMsgType> = {
    event: T
    data: MessageData<U>
  } & (T extends 'private' ? CommonTypes.IDeviceId : Partial<CommonTypes.IDeviceId>)

  interface IWsResponse<T, U> extends CommonTypes.IDeviceId {
    /**
     * 状态码
     */
    status: T
    message: U
  }
  type LoginValidate<T> = { isValidate: boolean; errMsg: T; errorCode: number }

  type MessageData<T> = {
    command: T
    days?: number
    id?: string
    interval?: number,
    key?: string
  }
  type WsConnError = CommonTypes.IDeviceId & { message: string }
}
