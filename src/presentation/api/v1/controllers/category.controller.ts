import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDTO } from '@application/category/dto/create-category.dto';
import { CreateCategoryUseCase } from '@application/category/usecases/create-category.usecase';
import { Category } from '@domain/categories/entities/category.entity';
import { FindCategoryById } from '@application/category/usecases/find-category-by-id.usecase';

@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly findCategoryById: FindCategoryById,
  ) {}

  @Post()
  async createNewCategory(@Body() data: CreateCategoryDTO): Promise<Category> {
    return await this.createCategoryUseCase.execute(data);
  }

  @Get(':id')
  async findCategory(@Param('id') id: string): Promise<Category> {
    return await this.findCategoryById.execute(id);
  }
}
