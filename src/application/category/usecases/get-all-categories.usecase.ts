import { Injectable } from '@nestjs/common';
import { Category } from '@domain/categories/entities/category.entity';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { UseCase } from '@shared/interfaces/usecase.interface';

@Injectable()
export class GetAllCategoriesUseCase implements UseCase<undefined, Category[]> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(_: undefined): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
