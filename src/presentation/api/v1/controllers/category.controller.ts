import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryDTO } from '@application/category/dto/create-category.dto';
import { CreateCategoryUseCase } from '@application/category/usecases/create-category.usecase';
import { Category } from '@domain/categories/entities/category.entity';

@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

  @Post()
  async createNewCategory(@Body() data: CreateCategoryDTO): Promise<Category> {
    return await this.createCategoryUseCase.execute(data);
  }
}
