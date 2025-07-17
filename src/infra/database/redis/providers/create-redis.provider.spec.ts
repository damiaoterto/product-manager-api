import { Provider } from '@nestjs/common';
import { createClient } from 'redis';
import { createRedisProvider } from './create-redis.provider';

jest.mock('redis', () => ({
  createClient: jest.fn(),
}));

jest.mock('../constants', () => ({
  REDIS_CLIENT: 'MOCK_REDIS_CLIENT_TOKEN',
}));

describe('createRedisProvider', () => {
  let mockRedisClient: any;

  beforeEach(() => {
    mockRedisClient = {
      on: jest.fn(),
      connect: jest.fn(),
    };

    (createClient as jest.Mock).mockReturnValue(mockRedisClient);

    jest.clearAllMocks();
  });

  it('should create a redis client and return a valid provider', () => {
    const provider: Provider = createRedisProvider();

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(provider).toBeDefined();
  });
});
