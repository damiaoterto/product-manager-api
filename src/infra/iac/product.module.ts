import { Module } from '@nestjs/common';
import { CreateProductUseCase } from '@application/product/usecase/create-product.usecase';
import { GetProductByIdUseCase } from '@application/product/usecase/get-product-by-id.usecase';
import { GetAllProductsUseCase } from '@application/product/usecase/get-all-products.usecase';

@Module({
  providers: [
    CreateProductUseCase,
    GetProductByIdUseCase,
    GetAllProductsUseCase,
  ],
})
export class ProductModule {}
