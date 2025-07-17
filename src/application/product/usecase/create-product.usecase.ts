import { UseCase } from '@shared/interfaces/usecase.interface';
import { Product } from '@domain/products/entities/product.entity';
import { ProductRepository } from '@domain/products/repositories/product.repository';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDTO } from '../dto/create-product.dto';

@Injectable()
export class CreateProductUseCase
  implements UseCase<CreateProductDTO, Product>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute({
    name,
    description,
    price,
    categories,
  }: CreateProductDTO): Promise<Product> {
    const getAllCategories = categories.map(async (categoryName) => {
      const category =
        await this.categoryRepository.findOneByName(categoryName);

      if (!category) {
        throw new HttpException(
          `Category '${categoryName}' not found`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return category;
    });

    const allCategories = await Promise.all(getAllCategories);

    const product = Product.create({
      name,
      description,
      price,
      categories: allCategories,
    });

    await this.productRepository.createNew(product);

    return product;
  }
}
