import { createClient, RedisClientType } from 'redis'

export const connectRedis = async (): Promise<any> => {
  const client = createClient()
  client.on('error', (err) => console.log('Redis Client Error', err))
  await client.connect()
  return client
}
