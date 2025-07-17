import { Product } from '@domain/products/entities/product.entity';
import { ProductRepository } from '@domain/products/repositories/product.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UseCase } from '@shared/interfaces/usecase.interface';

@Injectable()
export class GetProductByIdUseCase implements UseCase<string, Product> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    const existsProduct = await this.productRepository.findOneById(id);

    if (!existsProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return existsProduct;
  }
}
