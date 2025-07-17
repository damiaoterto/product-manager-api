import { Module } from '@nestjs/common';
import { CreateCategoryUseCase } from '@application/category/usecases/create-category.usecase';
import { CategoryController } from '@presentation/api/v1/controllers/category.controller';
import { FindCategoryById } from '@application/category/usecases/find-category-by-id.usecase';

@Module({
  providers: [CreateCategoryUseCase, FindCategoryById],
  controllers: [CategoryController],
})
export class CategoryModule {}
