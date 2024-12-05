import { Module } from '@nestjs/common'
import { BroadcastController } from './broadcast.controller'
import { BroadcastService } from './broadcast.service'
import { HttpModule } from '@nestjs/axios';
import { WsModule } from '../ws/ws.module';
@Module({
  imports: [HttpModule,WsModule],
  controllers: [BroadcastController],
  providers: [BroadcastService]
})
export class BroadcastModule {}
