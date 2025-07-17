import { Module } from '@nestjs/common';
import { CreateCategoryUseCase } from '@application/category/usecases/create-category.usecase';
import { CategoryController } from '@presentation/api/v1/controllers/category.controller';
import { FindCategoryById } from '@application/category/usecases/find-category-by-id.usecase';
import { GetAllCategoriesUseCase } from '@application/category/usecases/get-all-categories.usecase';
import { UpdateCategoryUseCase } from '@application/category/usecases/update-category.usecase';
import { DeleteCategoryUseCase } from '@application/category/usecases/delete-category.usecase';

@Module({
  providers: [
    CreateCategoryUseCase,
    FindCategoryById,
    GetAllCategoriesUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}
