import { Provider } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_CLIENT } from '../constants';

export function createRedisProvider(): Provider {
  const redis = createClient({ url: process.env.REDIS_URI });

  return {
    provide: REDIS_CLIENT,
    useValue: redis,
  };
}
