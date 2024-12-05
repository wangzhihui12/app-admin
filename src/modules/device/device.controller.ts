import { Controller, Get, Post, Body, UseInterceptors, Query, UsePipes, Inject } from '@nestjs/common'
import { DeviceService } from './device.service'
import { TransformInterceptor } from '../../common/interceptors'
import { AddDeviceInfoDto, DeviceFindOneDto, DeviceQueryDto, DeviceStatusDto, UpdateDeviceInfoDto } from '../../dto'
import { PagesPipe, ValidationPipe } from '../../common/pipes'
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter'
import { WsAccess, Events, WsMessageType, Command, RESPONSE_CODE } from '../../common/enums'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

@ApiTags('设备管理')
@Controller('device')
@UseInterceptors(TransformInterceptor)
// @UsePipes(new ValidationPipe({transform: true}))
@UsePipes(new ValidationPipe()) // 使用管道验证
export class DeviceController {
  /**
   * 构造函数，注入DeviceService和EventEmitter2
   * @param param - 包含设备信息的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  constructor(
    @Inject(DeviceService)
    private readonly deviceService: DeviceService,
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2
  ) {}

  /**
   * 查找所有设备的方法
   * 该方法接收一个包含查询条件的对象，并返回符合条件的设备列表
   * @param param - 包含查询条件的对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Get()
  @UsePipes(new PagesPipe())
  @ApiOperation({ summary: '获取所有设备列表' })
  async findAll(@Query() params: DeviceQueryDto): Promise<CommonTypes.IResData> {
    return await this.deviceService.findAll(params)
  }

  async finOne(@Query() params: DeviceFindOneDto): Promise<CommonTypes.IResData> {
    return await this.deviceService.findOne(params)
  }
  /**
   * 添加设备的方法
   * 该方法接收一个包含设备信息的DTO对象，并返回添加后的设备信息
   * @param param - 包含设备信息的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/add')
  @ApiOperation({ summary: '添加设备' })
  async addDevice(@Body() param: AddDeviceInfoDto): Promise<CommonTypes.IResponseBase> {
    return await this.deviceService.addDevice(param)
  }
  /**
   * 添加设备信息的方法
   * 该方法接收一个包含设备信息的DTO对象，并返回添加后的设备信息
   * @param param - 包含设备信息的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/addInfo')
  @ApiOperation({ summary: '添加设备信息' })
  async addDeviceInfo(@Body() param: UpdateDeviceInfoDto): Promise<CommonTypes.IResData> {
    return await this.deviceService.addDeviceInfo(param)
  }

  /**
   * 更新设备信息的方法
   * 该方法接收一个包含设备信息的DTO对象，并返回更新后的设备信息
   * @param param - 包含设备信息的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/updateInfo')
  @ApiOperation({ summary: '修改设备信息' })
  async updateDeviceInfo(@Body() param: UpdateDeviceInfoDto): Promise<CommonTypes.IResData> {
    return await this.deviceService.updateDeviceInfo(param)
  }

  /**
   * 更新设备状态的方法
   * 该方法接收一个包含设备状态的DTO对象，并返回更新后的设备状态
   * @param param - 包含设备状态的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/upsertStatus')
  @OnEvent(Events.OnConnected)
  @ApiOperation({ summary: '更新设备状态' })
  async upsertDeviceStatus(@Body() param: DeviceStatusDto): Promise<void | CommonTypes.IResData> {
    return await this.deviceService.upsertDeviceStatus(param).catch(error => {
      const out: WsTypes.WsConnError = { message: WsAccess.ConnFailure, device_id: param.device_id }
      this.eventEmitter.emit(Events.OnConnectError, out)
    })
  }
  @Post('/upsertFileRemovedTime')
  @OnEvent(Events.OnLogFileRemoved)
  @ApiOperation({ summary: '更新设备状态' })
  async upsertFileRemovedTime(@Body() param: DeviceStatusDto): Promise<void | CommonTypes.IResData> {
    return await this.deviceService.upsertFileRemovedTime(param)
  }

  /**
   * 重置所有设备状态的方法
   * 该方法接收一个包含设备状态的DTO对象，并返回更新后的设备状态
   * @param param - 包含设备状态的DTO对象
   * @returns 一个Promise，成功时解析为包含CommonTypes.IResponseBase接口的CommonTypes.IResData对象
   */
  @Post('/offlineAll')
  @OnEvent(Events.OnOfflineAll)
  @ApiOperation({ summary: '修改所有设备状态为离线' })
  async resetAllDeviceStatus(): Promise<void | CommonTypes.IResData> {
    return await this.deviceService.resetAllDeviceStatus()
  }

  @Get('/task')
  @OnEvent(Events.OnDailyTaskStart)
  @ApiOperation({ summary: '每日任务' })
  async task(): Promise<void | CommonTypes.IResData> {
    return await this.deviceService.removeFilesTask()
  }
  @Get('/addAll')
  @ApiOperation({ summary: '批量导入设备,用于初始化数据' })
  async addAll(devices: Array<any>): Promise<void | CommonTypes.IResData> {
    // return this.deviceService.addAll(devices)
  }
}
