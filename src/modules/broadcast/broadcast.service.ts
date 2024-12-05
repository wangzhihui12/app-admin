import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { ConfigService } from 'nestjs-config'
import { Command, Events, RESPONSE_CODE, WsMessageType } from '../../common/enums'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { WsGateway } from '../ws/ws.gateway'
@Injectable()
export class BroadcastService {
  private webHook: string
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
    private readonly wsGateway: WsGateway

  ) {
    this.webHook = this.config.get('env').AppWebhook
  }

  async send(message: WsTypes.MessageBody<Command, WsMessageType>): Promise<CommonTypes.IResData> {
    // const success = await this.eventEmitter.emitAsync(Events.OnMessageToSendClient, message)
    return this.wsGateway.send(message)
    // return { code: success ? RESPONSE_CODE.SUCCESS : RESPONSE_CODE.NOSUCCESS, data: { success } }
  }
  // // 广播消息
  async onMessage(param: any): Promise<CommonTypes.IResData> {
    if (param?.code == RESPONSE_CODE.SUCCESS && param?.data?.command === Command.RemoveLog) {
      const statusInfo: DeviceStatus.IDeviceStatus = { device_id: param.device_id, last_log_remove_time: new Date() }
      this.eventEmitter.emit(Events.OnLogFileRemoved, statusInfo)
    }
    const res: AxiosResponse<any, any> = await this.httpService
      .post(this.webHook, {
        msgtype: 'text',
        text: {
          content: JSON.stringify(param)
        }
      })
      .toPromise()
    return { code: res.status, message: '发送企微消息成功' }
  }
}
