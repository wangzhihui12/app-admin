import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server, Socket } from 'socket.io'
import { WsService } from './ws.service'
import { Inject, Logger, Module, UseInterceptors, UsePipes } from '@nestjs/common'
import { WsMessageType, WsStatus, WsAccess, Command, WsAccessCode, Events } from '../../common/enums'
import { TransformInterceptor } from '../../common/interceptors'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { AuthService } from '../auth/auth.service'
import { OnEvent } from '@nestjs/event-emitter'

/**
 * WebSocket 网关
 *
 * @implements WsTypes.WebSocketGateway<Server,WsResponse<string>,any>
 * @implements OnGatewayConnection
 * @implements OnGatewayDisconnect
 * @implements OnGatewayInit
 */
@WebSocketGateway(+process.env.SOCKET_PORT, {
  cors: true // 允许跨域
})
@UseInterceptors(TransformInterceptor)
export class WsGateway implements WsTypes.WebSocketGateway<Server, Observable<WsResponse<string>>, any>, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  /**
   * 用于初始化私有订阅消息处理类的构造函数。
   *
   * @param wsService - 注入的 WebSocket 服务实例，用于处理 WebSocket 相关操作。
   */
  constructor(
    public readonly wsService: WsService,
    private readonly authService: AuthService
  ) {}
  /**
   * WebSocket 服务器实例
   */
  @WebSocketServer()
  server: Server
  /**
   * 处理私有订阅消息
   * @param data - 传入的数据
   * @returns 包含事件和数据的 Observable 对象
   */
  @SubscribeMessage(WsMessageType.Private)
  subPrivate(@MessageBody() data: any): Observable<WsResponse<string>> {
    this.wsService.onMessage(data)
    return from<string>('o').pipe(map(item => ({ event: WsMessageType.Private, data: item })))
  }

  /**
   * 处理系统订阅消息
   * @param data - 传入的数据
   * @returns 包含事件和数据的 Observable 对象
   */
  @SubscribeMessage(WsMessageType.System)
  async subSystem(@MessageBody() data: number): Promise<number> {
    return data
  }
  /**
   * 用户连接上
   * @param client client
   * @param args
   */
  handleConnection(client: Socket): WsTypes.IWsResponse<WsStatus, WsAccess> {
    const auth = client.handshake?.auth ?? client.handshake?.headers
    if (!auth) {
      return this.handleInvalidAuth(client, WsAccess.NotAllowed, WsAccessCode.NotAllowed)
    }
    const { token, deviceId } = auth
    if (!token) {
      return this.handleInvalidAuth(client, WsAccess.InValidToken, WsAccessCode.InValidToken)
    }
    if (!deviceId) {
      return this.handleInvalidAuth(client, WsAccess.InvalidDeviceId, WsAccessCode.InvalidDeviceId)
    }
    const verify = this.authService.verifyToken(String(token))
    if (!verify.isPass) {
      const errorCode = verify.isExpired ? WsAccessCode.TokenExpired : WsAccessCode.InValidToken
      return this.handleInvalidAuth(client, WsAccess.TokenExpired, errorCode)
    }
    return this.wsService.login(client, token, deviceId)
  }

  private handleInvalidAuth(client: Socket, errMsg: WsAccess, errorCode: WsAccessCode): WsTypes.IWsResponse<WsStatus, WsAccess> {
    const msg = `${errMsg} token->${client.handshake.auth?.token} deviceId->${client.handshake.auth?.deviceId}`
    Logger.error(msg)
    client.emit(WsMessageType.Private, { isValidate: false, errMsg, errorCode })
    client.disconnect()
    return {
      status: WsStatus.Offline,
      message: errMsg,
      device_id: client.handshake.auth?.deviceId
    }
  }

  /**
   * 用户断开连接
   * @param client client
   */

  handleDisconnect(client: Socket) {
    // 移除数据 socketID
    this.wsService.logout(client)
  }

  /**
   * 初始化
   * @param server
   */
  afterInit(server: Server) {
    Logger.warn('Websocket init... Port: ' + process.env.SOCKET_PORT)
    this.wsService.server = server
    // 重置 socketIds
    this.wsService.resetClients()
  }

  /**
   * 发送消息
   * @param payload
   */

  @OnEvent(Events.OnMessageToSendClient)
  public send(payload: WsTypes.MessageBody<Command, WsMessageType>): Promise<CommonTypes.IResData> {
    return this.wsService[{ [WsMessageType.Private]: 'sendPrivateMessage', [WsMessageType.System]: 'sendPublicMessage' }[payload.event]](payload)
  }

  @OnEvent(Events.OnConnectError)
  async onConnectError(out: WsTypes.WsConnError): Promise<void> {
    return this.wsService.onConnectError(out)
  }
}
