import { Module } from '@nestjs/common';
import { CreateCategoryUseCase } from '@application/category/usecases/create-category.usecase';
import { CategoryController } from '@presentation/api/v1/controllers/category.controller';

@Module({
  providers: [CreateCategoryUseCase],
  controllers: [CategoryController],
})
export class CategoryModule {}
