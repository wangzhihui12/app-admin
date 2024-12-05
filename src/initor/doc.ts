import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { name, description, version } from '../../package.json'
import { INestApplication } from '@nestjs/common'

export const docBuilder = (app: INestApplication<any>) => {
  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth() // 允许tonken鉴权
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('/api/doc', app, document)
}
