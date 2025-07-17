import { Injectable } from '@nestjs/common';
import { Product } from '@domain/products/entities/product.entity';
import { UseCase } from '@shared/interfaces/usecase.interface';
import { ProductRepository } from '@domain/products/repositories/product.repository';

@Injectable()
export class GetAllProductsUseCase implements UseCase<undefined, Product[]> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(_: undefined): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}
