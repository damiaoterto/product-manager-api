import { DynamicModule } from '@nestjs/common';
import { createPrismaProvider } from './providers/create-prisma.provider';
import { PrismaService } from './services/prisma.service';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { PrismaCategoryRepository } from './repositories/prisma-category.repository';
import { ProductRepository } from '@domain/products/repositories/product.repository';
import { PrismaProductRepository } from './repositories/prisma-product.repository';

export class PrismaModule {
  static forRoot(): DynamicModule {
    const prismaProvider = createPrismaProvider();

    return {
      global: true,
      module: PrismaModule,
      providers: [
        prismaProvider,
        PrismaService,
        { provide: CategoryRepository, useClass: PrismaCategoryRepository },
        { provide: ProductRepository, useClass: PrismaProductRepository },
      ],
      exports: [CategoryRepository, ProductRepository],
    };
  }
}
