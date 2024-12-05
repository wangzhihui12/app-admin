import { Inject, Injectable } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { DeviceService } from '../device/device.service'
import { DeviceFindOneDto } from 'src/dto'
import { SnDto } from 'src/dto/base.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly deviceService: DeviceService,
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) {}

  async validateUser(user: DeviceFindOneDto): Promise<CommonTypes.IResData> {
    return await this.deviceService.findOne(user)
  }

  async validateSn(sn:string): Promise<CommonTypes.IResData<CommonTypes.IId&CommonTypes.ISn>> {
    return await this.deviceService.findOneBySn(sn)
  }

  getToken({ user, mobile }: DeviceFindOneDto): string {
    return this.jwtService.sign({ user, mobile })
  }
  getTokenBySn({ sn }: SnDto): string {
    return this.jwtService.sign({ sn })
  }
  verifyToken(token: string) {
    let res: { isPass: boolean; error: any; data: any; isExpired: boolean } = { isPass: true, error: null, data: null, isExpired: false }
    try {
      const verify = this.jwtService.verify(token)
      if (verify) {
        res.data = verify
      }
    } catch (error) {
      res = { isPass: false, error, data: null, isExpired: false }
      if (error instanceof TokenExpiredError) {
        res.isExpired = true
      }
    }
    return res
  }
}
