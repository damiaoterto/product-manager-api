import { Module } from '@nestjs/common';
import { CreateProductUseCase } from '@application/product/usecase/create-product.usecase';

@Module({
  providers: [CreateProductUseCase],
})
export class ProductModule {}
