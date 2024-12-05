import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { RESPONSE_CODE } from '../../common/enums'

@Injectable()
export class FieldsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createFieldDto: FieldTypes.TFieldAdd): Promise<CommonTypes.IResData> {
    const now = new Date()
    await this.prismaService.field.create({
      data: {
        name: createFieldDto.name,
        type: createFieldDto.type,
        created_at: now,
        updated_at: now
      }
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '创建字段成功' }
  }

  async findAll({ skip, take, name, type }: FieldTypes.TFieldQuery): Promise<CommonTypes.IResData<FieldTypes.IFiled[]>> {
    const where = {
      name: {
        contains: name
      },
      type
    }
    const result: FieldTypes.IFiled[] = await this.prismaService.field.findMany({ skip, take, where, orderBy: { created_at: 'desc' } })

    const total = await this.prismaService.field.count({ where })

    return { code: RESPONSE_CODE.SUCCESS, message: '查询成功', total, data: result }
  }
}
