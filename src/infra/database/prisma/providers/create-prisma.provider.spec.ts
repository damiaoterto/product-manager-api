import { Provider } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma';
import { createPrismaProvider } from './create-prisma.provider';

describe('createPrismaProvider', () => {
  it('should return a valid NestJS provider object for PrismaClient', () => {
    const expectedProvider: Provider = {
      provide: PrismaClient,
      useClass: PrismaClient,
    };

    const provider = createPrismaProvider();

    expect(provider).toBeDefined();
    expect(provider).toEqual(expectedProvider);
  });
});
