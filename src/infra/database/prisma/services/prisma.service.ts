import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@generated/prisma';
import { promiseAttempt } from '@utils/promise-attempt';

@Injectable()
export class PrismaService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly prismaClient: PrismaClient) {}

  async onModuleInit() {
    await promiseAttempt('Prisma Connection', async () => {
      await this.prismaClient.$connect();
      this.logger.log('Prisma ORM has connected');
    });
  }

  async onApplicationShutdown(signal?: string) {
    await this.prismaClient.$disconnect();
    this.logger.warn(`Database has disconnected, receive signal ${signal}`);
  }
}
