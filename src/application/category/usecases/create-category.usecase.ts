import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UseCase } from '@shared/interfaces/usecase.interface';
import { Category } from '@domain/categories/entities/category.entity';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { CreateCategoryDTO } from '../dto/create-category.dto';

@Injectable()
export class CreateCategoryUseCase
  implements UseCase<CreateCategoryDTO, Category>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute({ name, displayName }: CreateCategoryDTO): Promise<Category> {
    const existsCategory = await this.categoryRepository.findOneByName(name);

    if (existsCategory) {
      throw new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const category = Category.create({
      name,
      displayName,
    });

    await this.categoryRepository.createNew(category);

    return category;
  }
}
