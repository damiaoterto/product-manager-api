import { UseCase } from '@shared/interfaces/usecase.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductRepository } from '@domain/products/repositories/product.repository';

@Injectable()
export class DeleteProductUseCase implements UseCase<string, void> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findOneById(id);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    await this.productRepository.delete(id);
  }
}
