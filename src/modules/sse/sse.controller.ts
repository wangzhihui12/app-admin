import { Controller } from '@nestjs/common'
import { SseService } from './sse.service'
import { Sse } from '@nestjs/common'
import { Observable,interval } from 'rxjs'
import { map } from 'rxjs/operators'
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('event')
  sse(): Observable<any> {
    console.log('hello world')
    return interval(1000).pipe(map((_) => ({ data:'hello world' } )));
  }
  // sse(): Observable<MessageEvent> {
  //   return new Observable<any>(observer => {
  //     // 监听事件
  //     // this.eventEmitter.on(EVENTBUS_TYPE.MESSAGE_CREATE, (data: Message) => {
  //     // observer.next({ a: 111 })
  //     // })
      
  //     console.log('hello world1111111111')
  //     observer.next({ data: 'hello world2' });
  //   })
  // }
}
