import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryDTO } from '@application/category/dto/create-category.dto';

@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  @Post()
  async createNewCategory(@Body() data: CreateCategoryDTO) {
    // TODO
  }
}
