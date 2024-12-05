import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { BodyResponse } from '../../common/utils'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, CommonTypes.IResData> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<CommonTypes.IResData> {
    return next.handle().pipe(map((data:CommonTypes.IResData) => BodyResponse(data)))
  }
}
