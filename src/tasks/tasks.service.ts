import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cron, Interval, Timeout } from '@nestjs/schedule'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Events } from '../common/enums'

@Injectable()
export class TasksService {
  constructor(
    @Inject(EventEmitter2)
    private eventEmitter: EventEmitter2
  ) {}
  @Cron('0 10 0 * * *')
  handleCron() {
    this.eventEmitter.emit(Events.OnDailyTaskStart)
    Logger.warn('============开始每日定时任务=============')
  }

  // @Interval(5000)
  // handleInterval() {

  // }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.Logger.debug('Called once after 5 seconds');
  //   this.deviceService.removeFilesTask()
  // }
}
