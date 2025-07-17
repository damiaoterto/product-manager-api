import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UseCase } from '@shared/interfaces/usecase.interface';

@Injectable()
export class DeleteCategoryUseCase implements UseCase<string, void> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string): Promise<void> {
    const exitsCategory = await this.categoryRepository.findOneById(id);

    if (!exitsCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.delete(exitsCategory.id!);
  }
}
