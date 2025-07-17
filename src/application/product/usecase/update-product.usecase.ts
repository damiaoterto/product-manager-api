import { UseCase } from '@shared/interfaces/usecase.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductDTO } from '../dto/update-product.dto';
import { ProductRepository } from '@domain/products/repositories/product.repository';

type UpdateData = UpdateProductDTO & { id: string };

@Injectable()
export class UpdateProductUseCase implements UseCase<UpdateData, void> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({ id, name, price, description }: UpdateData): Promise<void> {
    const product = await this.productRepository.findOneById(id);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    await this.productRepository.update(id, { name, price, description });
  }
}
