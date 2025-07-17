import { DynamicModule } from '@nestjs/common';
import { createRedisProvider } from './providers/create-redis.provider';

export class RedisModule {
  static forRoot(): DynamicModule {
    const redisProvider = createRedisProvider();

    return {
      global: true,
      module: RedisModule,
      providers: [redisProvider],
    };
  }
}
