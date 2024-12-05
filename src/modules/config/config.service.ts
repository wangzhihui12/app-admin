import { Injectable, Inject } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { RESPONSE_CODE } from '../../common/enums'
@Injectable()
export class ConfigService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService // private connection: Connection,
  ) {}
  async findAll({ device_id, skip, take }: ConfigTypes.LogConfigQuery): Promise<CommonTypes.IResData<ConfigTypes.LogConfigResult[]>> {
    const where: any = {
      device_id
    }
    const result: ConfigTypes.LogConfigResult[] = await this.prisma.log_config.findMany({
      skip,
      take,
      select: {
        device_id: true,
        log_saved_days: true
      },
      where
    })
    const total = await this.prisma.log_config.count({
      where
    })
    const resBody: CommonTypes.IResData<ConfigTypes.LogConfigResult[]> = { total, data: result, code: RESPONSE_CODE.SUCCESS, message: '查询成功' }
    return resBody
  }

  async upsertConfig(config: Partial<ConfigTypes.ILogConfig>): Promise<CommonTypes.IResData> {
    const now = new Date()
    await this.prisma.log_config.upsert({ where: { device_id: config.device_id }, update: { ...config, updated_at: now }, create: { ...config, created_at: now, updated_at: now } })
    return { code: RESPONSE_CODE.SUCCESS, message: '设备状态更新成功' }
  }
}
