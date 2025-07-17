import { DynamicModule } from '@nestjs/common';
import { createPrismaProvider } from './providers/create-prisma.provider';
import { PrismaService } from './services/prisma.service';

export class PrismaModule {
  static forRoot(): DynamicModule {
    const prismaProvider = createPrismaProvider();

    return {
      module: PrismaModule,
      providers: [prismaProvider, PrismaService],
    };
  }
}
