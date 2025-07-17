import { Module } from '@nestjs/common';
import { CreateProductUseCase } from '@application/product/usecase/create-product.usecase';
import { GetProductByIdUseCase } from '@application/product/usecase/get-product-by-id.usecase';
import { GetAllProductsUseCase } from '@application/product/usecase/get-all-products.usecase';
import { UpdateProductUseCase } from '@application/product/usecase/update-product.usecase';
import { DeleteProductUseCase } from '@application/product/usecase/delete-product.usecase';

@Module({
  providers: [
    CreateProductUseCase,
    GetProductByIdUseCase,
    GetAllProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
})
export class ProductModule {}
