import { Module } from '@nestjs/common';
import { CategoryController } from 'src/presentation/api/v1/controllers/category.controller';

@Module({
  controllers: [CategoryController],
})
export class CategoryModule {}
