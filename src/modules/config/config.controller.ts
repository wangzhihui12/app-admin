import { Controller, Post, Body, UseInterceptors, Get, UsePipes, Param, Query } from '@nestjs/common'
import { ConfigService } from './config.service'
import { TransformInterceptor } from '../../common/interceptors'
import { LogConfigDto } from '../../dto/config.dto'
import { PagesPipe, ParseDeviceIdPipe, ValidationPipe } from '../../common/pipes'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('设备配置信息')
@Controller('config')
@UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe()) // 使用管道验证
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @UsePipes(new PagesPipe())
  @UsePipes(new ParseDeviceIdPipe())
  @ApiOperation({ summary: '根据设备号获取配置' })
  async findAll(@Query() params: LogConfigDto): Promise<CommonTypes.IResData<ConfigTypes.LogConfigResult[]>> {
    return this.configService.findAll(params)
  }
  @Post('/add')
  @ApiOperation({ summary: '新增或更新设备配置,de' })
  upsertConfig(@Body() param: LogConfigDto): Promise<CommonTypes.IResData> {
    return this.configService.upsertConfig(param)
  }
}
