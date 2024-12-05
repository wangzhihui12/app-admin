import { INestApplication } from '@nestjs/common'
import { ValidationPipe } from '../common/pipes/validation.pipe'
// import { LoggingInterceptor } from '../common/interceptors/logging.interceptor'
import { ExceptionsFilter, HttpExceptionFilter } from '../common/filters'
import { docBuilder } from './doc'
import { wsRedisAdapter } from './ws'
import { join } from 'path'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
export default class Initializer {
  static async use(app) {
    app.useGlobalFilters(new ExceptionsFilter())
    app.useGlobalFilters(new HttpExceptionFilter())
    app.enableCors()
    // 全局使用中间件
    // app.use(logger)
    // app.useGlobalFilters(new ValidateExceptionFilter())
    // 全局管道
    app.useGlobalPipes(new ValidationPipe())
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
    // 全局拦截器
    // app.useGlobalInterceptors(new LoggingInterceptor())
    app.useStaticAssets(join(__dirname, '..', '..', process.env.STATIC_PATH))
    // 初始化文档
    docBuilder(app)
    // 初始化websocket
    await wsRedisAdapter(app)
  }
}
