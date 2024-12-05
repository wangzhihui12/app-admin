import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { Socket } from 'socket.io'

@Injectable()
export class PagesPipe implements PipeTransform<CommonTypes.IPageIn> {
  async transform(value: CommonTypes.IPageIn) {
    const { pageIndex = 1, pageSize = 10 } = value
    const skip = (pageIndex - 1) * pageSize
    value.skip = +skip < 0 ? 0 : skip
    value.take = +pageSize
    return value
  }
}
@Injectable()
export class FilePathPipe implements PipeTransform<Express.Multer.File> {
  async transform(file: Express.Multer.File) {
    file.path = file.path.split(process.env.STATIC_PATH).pop().replace(/\\/g, '/')
    return file
  }
}
@Injectable()
export class ParseDeviceIdPipe implements PipeTransform<any, any> {
  transform(value: any, metadata: ArgumentMetadata): any {
    // 创建一个新对象，以避免直接修改原始值
    const transformedValue = { ...value }
    // 检查 device_id 是否存在并且是字符串类型
    if (typeof transformedValue.device_id === 'string') {
      const deviceId = parseInt(transformedValue.device_id, 10)
      // 检查转换后的值是否是有效的数字
      if (isNaN(deviceId)) {
        throw new BadRequestException('device_id must be a valid number')
      }
      // 更新 device_id 字段为数字类型
      transformedValue.device_id = deviceId
    }
    // 返回转换后的值，其中 device_id 是数字类型，其他字段保持不变
    return transformedValue
  }
}

@Injectable()
export class ParseIdPipe implements PipeTransform<any, any> {
  transform(value: any, metadata: ArgumentMetadata): any {
    // 创建一个新对象，以避免直接修改原始值
    const transformedValue = { ...value }
    // 检查 id 是否存在并且是字符串类型
    if (typeof transformedValue.id === 'string') {
      const id = parseInt(transformedValue.id, 10)
      // 检查转换后的值是否是有效的数字
      if (isNaN(id)) {
        throw new BadRequestException('id must be a valid number')
      }
      // 更新 id 字段为数字类型
      transformedValue.id = id
    }
    // 返回转换后的值，其中 id 是数字类型，其他字段保持不变
    return transformedValue
  }
}

