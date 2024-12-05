import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DeviceFindOneDto } from '../../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(user: DeviceFindOneDto): Promise<any> {
    const device = await this.authService.validateUser(user);
    if (!device) {
      throw new HttpException(
        { message: 'authorized failed', error: 'please try again later.' },
        HttpStatus.BAD_REQUEST);
    }
    return device;
  }
}
