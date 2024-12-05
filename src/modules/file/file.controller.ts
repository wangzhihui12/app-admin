import { Controller, Post, UploadedFile, UseInterceptors, Get, Res, Req, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { Response, Request } from 'express'
import { FileMimeTypeFilter } from '../../common/filters'
import { UploadFile } from '../../common/decorators'
import { DocTypes } from '../../common/enums'
import { FileDeleteDto, FileQueryDto } from '../../dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FilePathPipe, PagesPipe, ParseDeviceIdPipe, ParseIdPipe } from '../../common/pipes'
import { join } from 'path'
@ApiTags('文件管理')
@UsePipes(new ValidationPipe())
@Controller('file')
export class FileController {
  /**
   * 文件服务的构造函数。
   *
   * @param fileService - 文件服务的实例，用于处理文件相关操作。
   */
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传文件的方法
   * 该方法接收一个文件对象和一个请求对象，并将文件信息保存到数据库中
   * @param file - 包含文件信息的Express.Multer.File对象
   * @param req - 包含请求信息的Request对象
   * @returns 返回上传的文件对象
   */
  @Post('upload')
  @UsePipes(new FilePathPipe())
  @ApiOperation({ summary: '文件上传' })
  @UploadFile('file', { fileFilter: FileMimeTypeFilter('text/plain') })
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request): Promise<CommonTypes.IResData<FileTypes.FileUpload<DocTypes>>> {
    const { fieldname, encoding, stream, buffer, path: origin_path, ...o } = file
    const bodyData: Pick<FileTypes.FileUpload<DocTypes>, 'device_id' | 'type'> = { device_id: Number(req.body.deviceId), type: req.body.type }
    const f: FileTypes.FileUpload<DocTypes> = Object.assign({ created_at: new Date(), path: `${req.protocol}://${req.get('Host')}${origin_path}` }, bodyData, o)
    return await this.fileService.save(f)
  }

  /**
   * 获取所有文件的方法
   * 该方法接收一个文件类型和一个设备ID和文件名，并返回该设备下所有指定类型的文件
   * @param params - 包含文件类型和设备ID的对象
   * @returns 返回该设备下所有指定类型的文件
   */
  @Get('list')
  @UsePipes(new PagesPipe())
  @UsePipes(new ParseDeviceIdPipe())
  @ApiOperation({ summary: '获取文件列表' })
  async findAll(@Query() params: FileQueryDto): Promise<CommonTypes.IResData<FileTypes.IFile<DocTypes | string>[]>> {
    return await this.fileService.findAll(params)
  }

  /**
   * 删除文件的方法
   * 该方法接收一个文件ID，并将文件从数据库中删除
   * @param id - 要删除的文件ID
   * @returns 返回删除结果
   */
  @Get('delete')
  @UsePipes(new ParseIdPipe())
  @ApiOperation({ summary: '根据ID删除文件' })
  async remove(@Query() { id }: FileDeleteDto): Promise<CommonTypes.IResData> {
    return await this.fileService.remove(id as number)
  }

  /**
   * 导出所有文件的方法
   * 该方法将所有文件打包成一个tar文件并返回给客户端
   * @param res - 包含响应信息的Response对象
   * @returns 返回打包后的tar文件
   */
  // @Get('export')
  // async downloadAll(@Res() res: Response) {
  //   const { filename, tarStream } = await this.fileService.downloadAll()
  //   res.setHeader('Content-Type', 'application/octet-stream')
  //   res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
  //   tarStream.pipe(res)
  // }
}
