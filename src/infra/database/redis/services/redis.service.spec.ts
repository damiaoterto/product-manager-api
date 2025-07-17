import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { promiseAttempt } from '@utils/promise-attempt';
import { isJson } from '@utils/is-json';
import { RedisService } from './redis.service';
import { REDIS_CLIENT } from '../constants';

jest.mock('@utils/promise-attempt', () => ({
  promiseAttempt: jest.fn().mockImplementation(async (_, fn) => await fn()),
}));

jest.mock('@utils/is-json');

describe('RedisService', () => {
  let service: RedisService;
  let redisClient: RedisClientType;

  const mockRedisClient = {
    connect: jest.fn(),
    on: jest.fn(),
    destroy: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(), // Adicionado o mock para o método del
  };

  const loggerLogSpy = jest
    .spyOn(Logger.prototype, 'log')
    .mockImplementation(() => {});
  const loggerWarnSpy = jest
    .spyOn(Logger.prototype, 'warn')
    .mockImplementation(() => {});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: REDIS_CLIENT,
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    redisClient = module.get<RedisClientType>(REDIS_CLIENT);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to redis, log a success message, and set up an error listener', async () => {
      await service.onModuleInit();

      expect(promiseAttempt).toHaveBeenCalledWith(
        'Redis Connection',
        expect.any(Function),
      );
      expect(redisClient.connect).toHaveBeenCalledTimes(1);
      expect(loggerLogSpy).toHaveBeenCalledWith('Redis has connected');
      expect(redisClient.on).toHaveBeenCalledWith(
        'error',
        expect.any(Function),
      );
    });
  });

  describe('onApplicationShutdown', () => {
    it('should destroy the redis client and log a warning message', async () => {
      const signal = 'SIGTERM';
      await service.onApplicationShutdown(signal);

      expect(redisClient.destroy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        `Redis has disconnected, received signal ${signal}`,
      );
    });
  });

  describe('get', () => {
    it('should return null if key does not exist', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      const result = await service.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should return a plain string if value is not JSON', async () => {
      const value = 'plain string';
      mockRedisClient.get.mockResolvedValue(value);
      (isJson as jest.Mock).mockReturnValue(false);

      const result = await service.get('string-key');

      expect(isJson).toHaveBeenCalledWith(value);
      expect(result).toBe(value);
    });

    it('should parse and return an object if value is a JSON string', async () => {
      const value = { message: 'hello' };
      const stringifiedValue = JSON.stringify(value);
      mockRedisClient.get.mockResolvedValue(stringifiedValue);
      (isJson as jest.Mock).mockReturnValue(true);

      const result = await service.get<{ message: string }>('json-key');

      expect(isJson).toHaveBeenCalledWith(stringifiedValue);
      expect(result).toEqual(value);
    });
  });

  describe('set', () => {
    it('should set a string value directly', async () => {
      const key = 'my-key';
      const value = 'my-value';
      await service.set(key, value);

      expect(redisClient.set).toHaveBeenCalledWith(key, value);
    });

    it('should stringify an object value before setting', async () => {
      const key = 'my-object-key';
      const value = { a: 1, b: 'test' };
      const stringifiedValue = JSON.stringify(value);
      await service.set(key, value);

      expect(redisClient.set).toHaveBeenCalledWith(key, stringifiedValue);
    });
  });

  describe('del', () => {
    it('should call the del method on the redis client with the correct key', async () => {
      const key = 'key-to-delete';
      await service.del(key);

      expect(redisClient.del).toHaveBeenCalledWith(key);
      expect(redisClient.del).toHaveBeenCalledTimes(1);
    });
  });
});
