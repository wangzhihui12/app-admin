import { Module } from '@nestjs/common'
import { WsGateway } from './ws.gateway'
import { WsService } from './ws.service'
import { AuthModule } from '../auth/auth.module'
@Module({
  imports: [AuthModule],
  providers: [WsGateway, WsService],
  exports: [WsGateway]
})
export class WsModule {}
