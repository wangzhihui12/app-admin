import { Controller, Post, Body, UseInterceptors, UsePipes, Logger } from '@nestjs/common'
import { BroadcastService } from './broadcast.service'
import { TransformInterceptor } from '../../common/interceptors'
import { BroadcastDto } from '../../dto'
import { ParseDeviceIdPipe, ValidationPipe } from '../../common/pipes'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { OnEvent } from '@nestjs/event-emitter'
import { Events } from '../../common/enums'

@ApiTags('广播')
@Controller('broadcast')
@UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe()) // 使用管道验证
export class BroadcastController {
  /**
   * 
   */
  constructor(
    private readonly broadcastService: BroadcastService
  ) {}

  /**
   * 发送广播消息
   * @param params - 包含广播消息的对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/cmd')
  @ApiOperation({ summary: '给设备发送指令' })
  @UsePipes(new ParseDeviceIdPipe())
  async message(@Body() params: BroadcastDto): Promise<CommonTypes.IResData> {
    return this.broadcastService.send(params)
  }
  @OnEvent(Events.OnMessage)
  onMessage(@Body() params: any): Promise<CommonTypes.IResData> {
    Logger.warn(params)
    return this.broadcastService.onMessage(params)
  }
}
