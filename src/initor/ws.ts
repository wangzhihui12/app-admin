import { INestApplication } from '@nestjs/common'
import { RedisIoAdapter } from '../common/adapters'
export const wsRedisAdapter = async (app: INestApplication<any>) => {
  const redisIoAdapter = new RedisIoAdapter(app)
  await redisIoAdapter.connectToRedis()
  app.useWebSocketAdapter(redisIoAdapter)
}
