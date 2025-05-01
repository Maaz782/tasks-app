import { createClient, RedisClientType } from 'redis';

class RedisService {
  redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.redisClient.on('error', (err) => console.error('Redis Client Error', err));
  }

  public connect = async () => {
    try {
      await this.redisClient.connect();
      console.log('Redis connected');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  };

  public getClient = (): RedisClientType => {
    return this.redisClient;
  };


}

const redisService = new RedisService();
export const connectRedis = redisService.connect;
export default redisService;
