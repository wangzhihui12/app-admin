import { HttpException, HttpStatus, Injectable, Inject, OnModuleDestroy, OnApplicationShutdown } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { RESPONSE_CODE, WsAccess, Events, WsMessageType, WsStatus, Command } from '../../common/enums'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'

@Injectable()
export class WsService {
  constructor(
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2
  ) {}
  // ws 服务器, gateway 传进来
  server: Server

  // 存储连接的客户端
  clientIds: Map<number, string> = new Map()

  /**
   * 登录
   * @param client socket 客户端
   * @param token token
   * @returns
   */
  login(client: Socket, token: string, deviceId: number): WsTypes.IWsResponse<WsStatus, WsAccess> {
    const clientIsOnline: Socket = this.findClientByDeviceId(deviceId)
    // 处理同一设备号在多处登录
    this.handleDuplicateLogin(clientIsOnline, deviceId)
    // 保存工号
    this.clientIds.set(deviceId, client.id)
    const message = `Device-> ${deviceId}  [${client.id}] Has Connected, OnLine Number: ${this.allClients.size}`
    Logger.warn(message)
    this.server.emit(WsMessageType.System, message)
    const resData: WsTypes.IWsResponse<WsStatus, WsAccess> = {
      device_id: deviceId,
      status: WsStatus.Online,
      message: WsAccess.IsOnline
    }
    this.emit(Events.OnConnected, resData)
    return resData
  }

  /**
   * 处理重复登录
   * @param clientIsOnline 已经在线的客户端
   * @param deviceId 设备ID
   */
  private handleDuplicateLogin(clientIsOnline: Socket, deviceId: number) {
    if (clientIsOnline) {
      clientIsOnline.emit(WsMessageType.Private, `设备-> ${deviceId} 已在别处上线, 此客户端  [${clientIsOnline.id}] 下线处理`)
      clientIsOnline.disconnect()
      Logger.warn(`设备-> ${deviceId} 重复登录,  [${clientIsOnline.id}] 先登录的设备下线处理`)
    }
  }

  private findClientByDeviceId(deviceId: number): Socket {
    return this.allClients?.get(this.clientIds.get(deviceId))
  }

  private get allClients(): Map<string, Socket> {
    return this.server?.sockets?.sockets
  }
  /**
   * 登出
   * @param client client
   */
  async logout({ id }: Socket): Promise<CommonTypes.IResData<CommonTypes.IResponseBase>> {
    // 移除在线 client
    for (let [deviceId, clientId] of this.clientIds) {
      if (clientId === id) {
        this.clientIds.delete(deviceId)
        Logger.warn(`Device-> ${deviceId} [${id}] Logout, OnLine Number: ${this.clientIds.size}`)
        this.emit(Events.OnConnected, { status: WsStatus.Offline, message: WsAccess.IsOffline, device_id: deviceId })
        break
      }
    }
    return { data: { code: RESPONSE_CODE.SUCCESS, message: '登出成功' } }
  }
  async onConnectError(out: WsTypes.WsConnError): Promise<void> {
    const { device_id, message } = out
    const client: Socket = this.findClientByDeviceId(device_id)
    if (client) {
      Logger.error(`设备-> ${device_id} [${client.id}] 连接异常, 原因: ${message}`)
      client.emit(WsMessageType.Private, message)
      client.disconnect()
    }
  }
  private emit(event: Events, data?: WsTypes.IWsResponse<WsStatus, WsAccess>) {
    const { message, ...rest } = data || {}
    return this.eventEmitter.emit(event, rest)
  }

  /**
   * 重置 connectedClients
   */
  resetClients(): void {
    this.clientIds.clear()
    Logger.warn('========WebSocket初始化成功!重置所有客户端连接数据========')
  }

  /**
   * 发送公共消息(系统消息)
   * @param messagePath 发布地址
   * @param response 响应数据
   */
  async sendPublicMessage(payload: WsTypes.MessageBody<Command>): Promise<CommonTypes.IResData> {
    const res = this.server?.emit(WsMessageType.System, payload.data)
    if (!res) {
      Logger.log('Websocket Send Private Error->', payload)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: `发送失败`, error: 'send error' }, HttpStatus.BAD_REQUEST)
    }
    Logger.log(payload)
    return { code: RESPONSE_CODE.SUCCESS, message: '发送成功' }
  }

  /**
   * 发送私人消息(事务消息、个人消息)
   * @param messagePath 发布地址
   * @param response 响应数据
   * @param deviceId 接收者设备号
   */
  async sendPrivateMessage(payload: WsTypes.MessageBody<Command>): Promise<CommonTypes.IResData> {
    if (!payload.device_id) throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: '请求参数device_id 必传', error: 'deviceId is required' }, HttpStatus.BAD_REQUEST)
    const client = this.allClients?.get(this.clientIds.get(payload.device_id))
    const res = client?.emit(WsMessageType.Private, payload.data)
    if (!res) {
      Logger.error('Websocket Send Private Error->', payload)
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: `发送失败,客户端:(设备号->${payload.device_id}) 不在线`, error: 'send error' }, HttpStatus.BAD_REQUEST)
    }
    Logger.log(payload)
    return { code: RESPONSE_CODE.SUCCESS, message: '发送成功' }
  }
  onMessage(message: any) {
    this.emit(Events.OnMessage, message)
  }
}
