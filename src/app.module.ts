import { resolve } from 'path'
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule, ConfigService } from 'nestjs-config'
// import { MailerModule } from '@nest-modules/mailer'
import { StatusMonitorModule } from 'nest-status-monitor'
import statusMonitorConfig from './config/statusMonitor'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { TasksModule } from './tasks/tasks.module'
// import { AudioModule } from './jobs/audio/audio.module'
import { AuthModule } from './modules/auth/auth.module'
// import { HelloModule } from './modules/hello/hello.module'
import { DeviceModule } from './modules/device/device.module'
// import { ExceptionModule } from './modules/exception/exception.module'
// import { RoleGuardModule } from './modules/role-guard/role-guard.module'
// import { EmailModule } from './modules/email/email.module'
// import { UsersModule } from './modules/users/users.module'
import { FileModule } from './modules/file/file.module'
import { WsModule } from './modules/ws/ws.module'
// import { WsGateway } from './modules/ws/ws.gateway';
// import { SseModule } from './modules/sse/sse.module'
import { LogConfigModule } from './modules/config/config.module'
import { BroadcastModule } from './modules/broadcast/broadcast.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { HttpModule } from '@nestjs/axios'
import { FieldsModule } from './modules/fields/fields.module'
import { WinstonModule } from 'nest-winston'
import winstonLogger from './initor/winstion.config'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => config.get('http'),
      inject: [ConfigService]
    }),
    WinstonModule.forRoot({
      transports: winstonLogger.transports,
      format: winstonLogger.format,
      // defaultMeta: winstonLogger.defaultMeta,
      exitOnError: false // 防止意外退出
    }),
    // TODO @nestjs/terminus almost the same
    // StatusMonitorModule.setUp(statusMonitorConfig),
    // MailerModule.forRootAsync({
    //   useFactory: (config: ConfigService) => config.get('email'),
    //   inject: [ConfigService]
    // }),
    ScheduleModule.forRoot(), 
    EventEmitterModule.forRoot(),
    DeviceModule,
    TasksModule,
    // AudioModule,
    // HelloModule,
    // ExceptionModule,
    // RoleGuardModule,
    // EmailModule,
    // UsersModule,
    FileModule,
    // SseModule,
    AuthModule,
    WsModule,
    BroadcastModule,
    LogConfigModule,
    FieldsModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 为 hello 路由添加中间件
    // consumer.apply(LoggerMiddleware).exclude({ path: 'hello', method: RequestMethod.POST }).forRoutes('hello')
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
