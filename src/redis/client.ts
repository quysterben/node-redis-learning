import { RedisClientType } from 'redis'

import { connectRedis } from './connection'
import { REDIS_ACTION_CONSTANTS } from '~/constants/common'

export const redisClient = async (): Promise<RedisClientType> => {
  const client: RedisClientType = await connectRedis()
  return client
}

export const redisFunction = async (type: string, key: string, value: any = undefined): Promise<any> => {
  try {
    const client: RedisClientType = await redisClient()
    switch (type) {
      case REDIS_ACTION_CONSTANTS.SET:
        await client.set(key, value)
        break
      case REDIS_ACTION_CONSTANTS.GET:
        await client.get(key)
        break
      case REDIS_ACTION_CONSTANTS.DEL:
        await client.del(key)
        break
      default:
        throw new Error('Invalid type')
    }
    await client.quit()
  } catch (error) {
    return error
  }
}
