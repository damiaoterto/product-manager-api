import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/interfaces/usecase.interface';
import { Category } from '@domain/categories/entities/category.entity';
import { CreateCategoryDTO } from '../dto/create-category.dto';

@Injectable()
export class CreateCategoryUseCase
  implements UseCase<CreateCategoryDTO, Category>
{
  async execute(data: CreateCategoryDTO): Promise<Category> {
    throw new Error('Method not implemented.');
  }
}
