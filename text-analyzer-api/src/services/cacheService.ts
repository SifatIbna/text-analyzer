import Redis from 'ioredis';
import logger from '@config/logger';

let redis: Redis;

try {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined in environment variables');
  }

  redis = new Redis(process.env.REDIS_URL);

  redis.on('error', (error) => {
    logger.error('Redis connection error:', error);
  });

  redis.on('connect', () => {
    logger.info('Connected to Redis');
  });
} catch (error) {
  logger.error('Failed to initialize Redis client:', error);
  process.exit(1);
}

export class CacheService {
  static async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key);
    } catch (error) {
      this.logError('Cache get error', error, key);
      return null;
    }
  }

  static async set(key: string, value: string, expireIn: number = 3600): Promise<void> {
    try {
      await redis.set(key, value, 'EX', expireIn);
    } catch (error) {
      this.logError('Cache set error', error, key);
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      this.logError('Cache delete error', error, key);
    }
  }

  private static logError(message: string, error: unknown, key: string): void {
    if (error instanceof Error) {
      logger.error(message, { error: error.message, key });
    } else {
      logger.error(message, { error: 'An unknown error occurred', key });
    }
  }
}