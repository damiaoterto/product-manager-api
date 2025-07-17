import { describe, beforeEach, it, expect } from '@jest/globals';
import { PrismaClient } from '@generated/prisma';
import { Logger } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { promiseAttempt } from '@utils/promise-attempt';
import { PrismaService } from './prisma.service';

jest.mock('@utils/promise-attempt', () => ({
  promiseAttempt: jest
    .fn()
    .mockImplementation(async (name: string, fn: () => Promise<any>) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await fn();
    }),
}));

describe('PrismaService', () => {
  let service: PrismaService;
  let prismaClient: PrismaClient;

  const loggerLogSpy = jest
    .spyOn(Logger.prototype, 'log')
    .mockImplementation(() => {});

  const loggerWarnSpy = jest
    .spyOn(Logger.prototype, 'warn')
    .mockImplementation(() => {});

  const mockPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: PrismaClient,
          useValue: mockPrismaClient,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    prismaClient = module.get<PrismaClient>(PrismaClient);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to prisma and log a success message', async () => {
      await service.onModuleInit();

      expect(promiseAttempt).toHaveBeenCalledWith(
        'Prisma Connection',
        expect.any(Function),
      );

      expect(prismaClient.$connect).toHaveBeenCalledTimes(1);
      expect(loggerLogSpy).toHaveBeenCalledWith('Prisma ORM has connected');
    });

    it('should handle connection errors via promiseAttempt', async () => {
      mockPrismaClient.$connect.mockRejectedValueOnce(
        new Error('Connection failed'),
      );

      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
      expect(prismaClient.$connect).toHaveBeenCalledTimes(1);
      expect(loggerLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('onApplicationShutdown', () => {
    it('should disconnect from prisma and log a warning message', async () => {
      const signal = 'SIGTERM';

      await service.onApplicationShutdown(signal);

      expect(prismaClient.$disconnect).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        `Database has disconnected, receive signal ${signal}`,
      );
    });

    it('should work correctly even if the signal is not provided', async () => {
      await service.onApplicationShutdown();

      expect(prismaClient.$disconnect).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        `Database has disconnected, receive signal undefined`,
      );
    });
  });
});
