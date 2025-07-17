import { Category } from '@domain/categories/entities/category.entity';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UseCase } from '@shared/interfaces/usecase.interface';

@Injectable()
export class FindCategoryById implements UseCase<string, Category> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(data: string): Promise<Category> {
    const existsCategory = await this.categoryRepository.findOneById(data);

    if (!existsCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return existsCategory;
  }
}
