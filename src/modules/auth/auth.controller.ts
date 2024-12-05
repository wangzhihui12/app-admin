import { Body, Controller, Get, Post, Request, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { RESPONSE_CODE } from '../../common/enums'
import { ApiTags } from '@nestjs/swagger'
import { TransformInterceptor } from '../../common/interceptors'
import { DeviceFindOneDto } from 'src/dto'
import { SnDto } from 'src/dto/base.dto'

@Controller()
@ApiTags('权限管理')
@Controller('device')
@UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录测试
  // @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() {sn}: SnDto): Promise<CommonTypes.IResData> {
    const result: CommonTypes.IResData = await this.authService.validateSn(sn)
    if (result.code === RESPONSE_CODE.SUCCESS) {
      const token = this.authService.getTokenBySn({sn})
      result.data.token = token
    }
    return result
  }
  // 测试登录后才可访问的接口，在需要的地方使用守卫，可保证必须携带token才能访问
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    return req.user
  }
}
