import { DynamicModule } from '@nestjs/common';
import { createRedisProvider } from './providers/create-redis.provider';
import { RedisService } from './services/redis.service';

export class RedisModule {
  static forRoot(): DynamicModule {
    const redisProvider = createRedisProvider();

    return {
      global: true,
      module: RedisModule,
      providers: [redisProvider, RedisService],
      exports: [RedisService],
    };
  }
}
