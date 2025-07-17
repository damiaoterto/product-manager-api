import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCategoryDTO } from '@application/category/dto/create-category.dto';
import { CreateCategoryUseCase } from '@application/category/usecases/create-category.usecase';
import { Category } from '@domain/categories/entities/category.entity';
import { FindCategoryById } from '@application/category/usecases/find-category-by-id.usecase';
import { GetAllCategoriesUseCase } from '@application/category/usecases/get-all-categories.usecase';
import { UpdateCategoryDTO } from '@application/category/dto/update-category.dto';
import { UpdateCategoryUseCase } from '@application/category/usecases/update-category.usecase';
import { DeleteCategoryUseCase } from '@application/category/usecases/delete-category.usecase';

@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly findCategoryById: FindCategoryById,
    private readonly getAllCategoryUseCase: GetAllCategoriesUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Post()
  async createNewCategory(@Body() data: CreateCategoryDTO): Promise<Category> {
    return await this.createCategoryUseCase.execute(data);
  }

  @Get()
  async getAllCategories() {
    return this.getAllCategoryUseCase.execute(undefined);
  }

  @Get(':id')
  async findCategory(@Param('id') id: string): Promise<Category> {
    return await this.findCategoryById.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateCategory(
    @Param('id') id: string,
    @Body() data: UpdateCategoryDTO,
  ) {
    return await this.updateCategoryUseCase.execute({ id, ...data });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async DeleteCategory(@Param('id') id: string) {
    return await this.deleteCategoryUseCase.execute(id);
  }
}
