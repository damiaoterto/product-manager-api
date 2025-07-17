import { Provider } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma';

export function createPrismaProvider(): Provider {
  return {
    provide: PrismaClient,
    useClass: PrismaClient,
  };
}
