import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common'
import { FieldsService } from './fields.service'
import { CreateFieldDto, QueryFieldDto } from '../../dto'
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'
import { TransformInterceptor } from '../../common/interceptors'
import { PagesPipe } from '../../common/pipes'

@ApiTags('字段管理')
@Controller('fields')
@UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe())
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post('user/add')
  @ApiOperation({ summary: '创建字段' })
  async create(@Body() dto: CreateFieldDto): Promise<CommonTypes.IResData> {
    return await this.fieldsService.create(dto)
  }

  @Get('user/list')
  @UsePipes(new PagesPipe())
  @ApiOperation({ summary: '获取所有字段列表' })
  async findAll(@Query() dto: QueryFieldDto): Promise<CommonTypes.IResData<FieldTypes.IFiled[]>> {
    return await this.fieldsService.findAll(dto)
  }
}
