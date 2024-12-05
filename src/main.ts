import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import Initializer from './initor'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  await Initializer.use(app)
  await app.listen(process.env.APP_PORT)
}
bootstrap()
