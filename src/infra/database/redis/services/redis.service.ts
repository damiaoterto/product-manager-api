import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { REDIS_CLIENT } from '../constants';
import { RedisClientType } from 'redis';
import { promiseAttempt } from '@utils/promise-attempt';
import { isJson } from '@utils/is-json';

@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  async onModuleInit() {
    await promiseAttempt('Redis Connection', async () => {
      await this.redisClient.connect();
      this.logger.log('Redis has connected');
    });

    this.redisClient.on('error', (error) => {
      this.logger.error('Redis connection error: ', error);
    });
  }

  async onApplicationShutdown(signal?: string) {
    this.redisClient.destroy();
    this.logger.warn(`Redis has disconnected, received signal ${signal}`);
  }

  async get<T = string>(key: string): Promise<T | null> {
    const getValue = await this.redisClient.get(key);

    if (!getValue) return null;
    if (!isJson(getValue)) return getValue as T;

    return JSON.parse(getValue) as T;
  }

  async set(key: string, value: unknown): Promise<void> {
    if (typeof value === 'object') {
      const strObject = JSON.stringify(value);
      await this.redisClient.set(key, strObject);
      return;
    }

    await this.redisClient.set(key, value as string);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
