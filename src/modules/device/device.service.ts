import { Inject, Injectable, HttpException, HttpStatus, OnModuleInit, Logger } from '@nestjs/common'
// import { Repository, Connection, getRepository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Device as DeviceEntity } from '../entities/Device'
import { PrismaService } from 'nestjs-prisma'
import { Command, Events, RESPONSE_CODE, WsMessageType, WsStatus } from '../../common/enums'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class DeviceService implements OnModuleInit {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService, // private connection: Connection,
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2
  ) {}
  async onModuleInit() {
    this.resetAllDeviceStatus()
  }
  async findAll({ user, mobile, sn, skip, take, status }: DeviceTypes.IQueryDevices): Promise<CommonTypes.IResData<DeviceTypes.IDevice[]>> {
    const where = {
      sn: {
        contains: sn
      },
      device_info: {
        mobile: {
          contains: mobile
        },
        user: {
          contains: user
        }
      },
      device_status: {
        status: status || status == 0 ? +status : undefined
      }
    }
    const result: DeviceTypes.IDeviceResult[] = await this.prisma.device.findMany({
      skip,
      take,
      select: {
        id: true,
        sn: true,
        device_info: {
          select: {
            user: true,
            mobile: true,
            merchant_name: true
          }
        },
        log_config: {
          select: {
            log_saved_days: true
          }
        },
        fields: {
          select: {
            field: {
              select: {
                name: true,
                type: true
              }
            }
          }
        },
        device_status: {
          select: { status: true, last_log_remove_time: true, last_log_upload_time: true, last_login_time: true, last_offline_time: true }
        }
      },
      where,
      orderBy: { created_at: 'desc' }
    })
    const total: number = await this.prisma.device.count({
      where
    })
    const data: DeviceTypes.IDevice[] = result.reduce((pre: DeviceTypes.IDevice[], cur: DeviceTypes.IDeviceResult) => {
      pre.push({
        id: cur.id,
        sn: cur.sn,
        user: cur.device_info?.user,
        mobile: cur.device_info?.mobile,
        status: cur.device_status?.status,
        merchant_name: cur.device_info?.merchant_name,
        last_log_remove_time: cur.device_status?.last_log_remove_time,
        last_log_upload_time: cur.device_status?.last_log_upload_time,
        last_login_time: cur.device_status?.last_login_time,
        last_offline_time: cur.device_status?.last_offline_time,
        log_saved_days: cur?.log_config?.log_saved_days,
        fields: cur?.fields?.map((item: DeviceTypes.IFields) => ({ name: item.field.name, type: item.field.type }))
      })
      return pre
    }, [])
    const resBody: CommonTypes.IResData<DeviceTypes.IDevice[]> = { total, data }
    return resBody
  }

  async findOne({ user, mobile }: Pick<CommonTypes.IUser, 'mobile' | 'user'>): Promise<CommonTypes.IResData<DeviceTypes.TOneDeviceInfo>> {
    const deviceInfo: DeviceTypes.TOneDeviceInfo = await this.prisma.device_info.findFirstOrThrow({
      where: { user, mobile }
    })
    return { code: RESPONSE_CODE.SUCCESS, data: deviceInfo }
  }

  async findOneBySn(sn: string): Promise<CommonTypes.IResData<CommonTypes.IId & CommonTypes.ISn>> {
    try {
      const device: CommonTypes.IId & CommonTypes.ISn = await this.prisma.device.findFirstOrThrow({
        where: { sn }
      })
      return { code: RESPONSE_CODE.SUCCESS, data: device }
    } catch (error) {
      return { code: RESPONSE_CODE.NOSUCCESS, message: '用户验证失败!', error }
    }
  }

  async addDevice(device: Omit<DeviceTypes.IDeviceSaves, 'device_id'>): Promise<CommonTypes.IResData> {
    const { device_info, log_config, user_fields, sn } = device
    await this.prisma.$transaction(async prisma => {
      const now = new Date()
      const { id } = await prisma.device.create({ data: { sn, created_at: now }, select: { id: true } })
      const device_id = id
      if (device_info) {
        await prisma.device_info.create({ data: { device_id, user: device_info.user, mobile: device_info.mobile, merchant_name: device_info.merchant_name, updated_at: now, created_at: now } })
      }
      if (log_config) {
        await prisma.log_config.create({ data: { log_saved_days: log_config.log_saved_days, device_id, created_at: now, updated_at: now } })
      }
      if (user_fields) {
        await prisma.field_relation.deleteMany({ where: { device_id } })
        await prisma.field_relation.createMany({
          data: user_fields.map((item: number) => ({ device_id, field_id: item }))
        })
      }
      await prisma.device_status.create({ data: { device_id: id, status: WsStatus.Offline, last_log_remove_time: now } })
      // await this.addDeviceInfo(Object.assign({ device_id: id },deviceInfo))
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '添加设备成功' }
  }

  async addDeviceInfo(deviceInfo: DeviceTypes.IDeviceSaves): Promise<CommonTypes.IResData> {
    const now = new Date()
    const { device_id, ...data } = deviceInfo
    const { device_info, log_config, user_fields, sn } = data
    await this.prisma.$transaction(async prisma => {
      if (sn) {
        await prisma.device.update({ where: { id: device_id }, data: { sn } })
      }
      if (device_info) {
        await prisma.device_info.create({ data: { device_id, user: device_info.user, mobile: device_info.mobile, merchant_name: device_info.merchant_name, updated_at: now, created_at: now } })
      }
      if (log_config) {
        await prisma.log_config.create({ data: { log_saved_days: log_config.log_saved_days, device_id, created_at: now, updated_at: now } })
      }
      if (user_fields) {
        await prisma.field_relation.deleteMany({ where: { device_id } })
        await prisma.field_relation.createMany({
          data: user_fields.map((item: number) => ({ device_id, field_id: item }))
        })
      }
      await prisma.device_status.create({ data: { device_id, status: WsStatus.Offline, last_log_remove_time: now } })
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '添加设备信息成功' }
  }

  async updateDeviceInfo(deviceInfo: DeviceTypes.IDeviceSaves): Promise<CommonTypes.IResData> {
    const { device_id, ...data } = deviceInfo
    const where = { device_id }
    await this.prisma.$transaction(async prisma => {
      const now = new Date()
      const { device_info, log_config, user_fields, sn } = data
      if (sn) {
        await prisma.device.update({ where: { id: device_id }, data: { sn } })
      }
      if (device_info) {
        device_info.updated_at = now
        await prisma.device_info.update({
          where,
          data: { user: device_info.user, mobile: device_info.mobile, merchant_name: device_info.merchant_name, updated_at: now }
        })
      }
      if (log_config) {
        await prisma.log_config.update({
          where,
          data: { log_saved_days: log_config.log_saved_days, updated_at: now }
        })
      }
      if (user_fields) {
        await prisma.field_relation.deleteMany({ where })
        await prisma.field_relation.createMany({
          data: user_fields.map((item: number) => ({ device_id, field_id: item }))
        })
      }
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '设备信息更新成功' }
  }
  async upsertDeviceStatus(data: DeviceStatus.IDeviceStatus): Promise<CommonTypes.IResData> {
    const now = new Date()
    await this.prisma.device_status.upsert({
      where: { device_id: data.device_id },
      create: { device_id: data.device_id, status: WsStatus.Offline, last_log_remove_time: now },
      update: { status: data.status, last_login_time: data.status === WsStatus.Online ? now : undefined, last_offline_time: data.status === WsStatus.Offline ? now : undefined, last_log_remove_time: data.last_log_remove_time, last_log_upload_time: data.last_log_upload_time }
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '设备状态更新成功' }
  }
  async upsertFileRemovedTime(data: DeviceStatus.IDeviceStatus): Promise<CommonTypes.IResData> {
    await this.prisma.device_status.update({
      where: { device_id: data.device_id },
      data: { last_log_remove_time: data.last_log_remove_time }
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '设备状态更新成功' }
  }

  async resetAllDeviceStatus(): Promise<CommonTypes.IResData> {
    Logger.warn('========重置所有设备状态========')
    await this.prisma.device_status.updateMany({
      data: { status: WsStatus.Offline }
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '设备状态更新成功' }
  }

  async addAll(devices: Array<any>): Promise<CommonTypes.IResponseBase> {
    // devices  =[
    // {
    //     "设备编号": "26DYD23B25202154",
    //     "APP编码": "4DF8801064461802495A2452CCD04EE4",
    //     "保管人": "葛阳阳",
    //     "手机号": 15009585544,
    //     "品牌": "鸿蒙智行",
    //     "直营": "否",
    //     "业务场景": "延保",
    //     "督导": "刘洁琼",
    //     "最近使用时间": "2024-11-01",
    //     "最近使用人": "葛阳阳",
    //     "最近使用人所在门店": "银川华为2.(44212813)",
    //     "修改日期": "2024-09-19"
    // },
    // ]
    for (let index = 0; index < devices.length; index++) {
      const el = devices[index]
      await this.prisma.$transaction(async prisma => {
        const { id } = await prisma.device.create({ data: { sn: el.APP编码 }, select: { id: true } })
        await prisma.device_info.create({ data: { device_id: id, mobile: el.手机号 + '', merchant_name: el.最近使用人所在门店 || '', user: el.保管人, created_at: new Date(), updated_at: new Date() } })
        await prisma.device_status.create({ data: { device_id: id, status: WsStatus.Offline, last_log_remove_time: new Date() } })
        await prisma.log_config.create({ data: { device_id: id, log_saved_days: 30 } })
        await prisma.field_relation.createMany({
          data: [
            { device_id: id, field_id: 1 },
            { device_id: id, field_id: 2 },
            { device_id: id, field_id: 3 }
          ]
        })
      })
    }
    return { code: RESPONSE_CODE.SUCCESS, message: '添加成功' }
  }

  async removeFilesTask(): Promise<CommonTypes.IResData> {
    const results: DeviceTypes.TRemoveLogsResultByTask[] = await this.prisma.$queryRaw<DeviceTypes.TRemoveLogsResultByTask[]>`
    SELECT d.device_id, c.log_saved_days
    FROM device_info d
    JOIN log_config c ON c.device_id = d.device_id
    JOIN device_status s ON s.device_id = d.device_id
    WHERE c.log_saved_days < TIMESTAMPDIFF(DAY, s.last_log_remove_time, NOW()) AND s.status=1`
    return this.sendMessage(results)
  }

  async sendMessage(results: DeviceTypes.TRemoveLogsResultByTask[]): Promise<CommonTypes.IResData> {
    if (results.length) {
      const { device_id, log_saved_days } = results.pop()
      const message = { event: WsMessageType.Private, device_id, data: { command: Command.RemoveLog, days: log_saved_days } }
      this.eventEmitter.emit(Events.OnMessageToSendClient, message)
      await this.sendMessage(results)
    }
    return { code: RESPONSE_CODE.SUCCESS, message: '每日日志删除任务完成' }
  }
}
