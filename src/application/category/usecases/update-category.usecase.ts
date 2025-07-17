import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UseCase } from '@shared/interfaces/usecase.interface';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { UpdateCategoryDTO } from '../dto/update-category.dto';

type UpdateData = UpdateCategoryDTO & { id: string };

@Injectable()
export class UpdateCategoryUseCase implements UseCase<UpdateData, void> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute({ id, name, displayName }: UpdateData): Promise<void> {
    const exitsCategory = await this.categoryRepository.findOneById(id);

    if (!exitsCategory) {
      throw new HttpException('Category not exists', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.update(id, {
      name,
      displayName,
    });
  }
}
