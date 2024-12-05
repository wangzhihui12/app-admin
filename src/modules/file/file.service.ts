import { Inject, Injectable, Logger } from '@nestjs/common'
import { tar } from 'compressing'
import { ConfigService } from 'nestjs-config'
import * as fs from 'fs'
import * as path from 'path'
import { DocTypes, RESPONSE_CODE } from '../../common/enums'
import { PrismaService } from 'nestjs-prisma'
import { Doc } from 'prettier'
import { join } from 'path'

@Injectable()
export class FileService {
  /**
   * 文件服务的构造函数。
   *
   * @param configService - 配置服务的实例，用于获取配置信息。
   * @param prisma - PrismaService的实例，用于数据库操作。
   */
  constructor(
    private readonly configService: ConfigService,
    @Inject(PrismaService)
    private readonly prisma: PrismaService // private connection: Connection,
  ) {}

  /**
   * 获取所有文件的方法。
   *
   * @returns 一个 Promise，成功时解析为包含所有文件的 CommonTypes.IResData 对象。
   */
  async findAll({ device_id, type, filename, skip, take }: FileTypes.FindeFiles<DocTypes>): Promise<CommonTypes.IResData<FileTypes.IFile<DocTypes | string>[]>> {
    const where = {
      device_id,
      type,
      originalname: {
        contains: filename
      },
      filename: {
        contains: filename
      }
    }
    const files: FileTypes.IFile<DocTypes | string>[] = await this.prisma.file.findMany({ skip, take, where, orderBy: { created_at: 'desc' } })

    const total: number = await this.prisma.file.count({
      where
    })
    return { total, data: files }
  }

  /**
   * 保存文件到数据库的方法。
   *
   * @param file - 要保存的文件对象，包含文件名、路径、创建时间等信息。
   * @returns 一个 Promise，成功时解析为包含操作结果的 CommonTypes.IResData 对象。
   */
  async save(file: FileTypes.FileUpload<DocTypes>): Promise<CommonTypes.IResData> {
    const { filename, path, created_at, destination, size, ...where } = file
    await this.prisma.$transaction(async prisma => {
      const files: Pick<FileTypes.IFile<DocTypes>, 'id' | 'destination' | 'filename'>[] = await prisma.file.findMany({ where, select: { id: true, destination: true, filename: true } })
      if (files?.length) {
        files.forEach(async ({ id, destination: dest, filename: fname }) => {
          const origin_path = join(dest, fname)
          try {
            fs.existsSync(origin_path) && fs.unlinkSync(origin_path)
          } catch (err) {
            Logger.error('删除文件失败', err)
          }
          await prisma.file.update({ where: { id }, data: { filename, path, created_at, destination } })
        })
      } else {
        await prisma.file.create({ data: file })
      }
      await prisma.device_status.update({ where: { device_id: file.device_id }, data: { last_log_upload_time: created_at } })
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '文件保存成功', data: { path: file.path } }
  }

  /**
   * 从数据库中移除文件。
   *
   * @param id - 要移除的文件的唯一标识符。
   * @returns 一个 Promise，成功时解析为包含操作结果的 CommonTypes.IResData 对象。
   */
  async remove(id: number): Promise<CommonTypes.IResData> {
    await this.prisma.$transaction(async prisma => {
      const { path } = (await prisma.file.findFirst({ where: { id }, select: { path: true } })) || {}
      await prisma.file.delete({ where: { id } })
      fs.unlinkSync(path)
    })
    return { code: RESPONSE_CODE.SUCCESS, message: '删除成功' }
  }

  async downloadAll() {
    const uploadDir = this.configService.get('file').root
    const tarStream = new tar.Stream()
    await tarStream.addEntry(uploadDir)
    return { filename: 'hello-world.tar', tarStream }
  }
  moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const rs = fs.createReadStream(sourcePath)
      const ws = fs.createWriteStream(destinationPath)
      rs.on('error', reject)
      ws.on('error', reject)
      ws.on('finish', resolve)
      rs.pipe(ws)
    })
  }
  removeFileTask() {}
}
