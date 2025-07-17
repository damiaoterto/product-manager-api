import { CreateProductUseCase } from '@application/product/usecase/create-product.usecase';
import { DeleteProductUseCase } from '@application/product/usecase/delete-product.usecase';
import { GetAllProductsUseCase } from '@application/product/usecase/get-all-products.usecase';
import { GetProductByIdUseCase } from '@application/product/usecase/get-product-by-id.usecase';
import { UpdateProductUseCase } from '@application/product/usecase/update-product.usecase';
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
  UseInterceptors,
} from '@nestjs/common';
import { CacheKey } from '../decorators/cache-key.decorator';
import { CacheInterceptor } from '../interceptors/cache.interceptor';
import { CreateProductDTO } from '@application/product/dto/create-product.dto';
import { InvalidateCache } from '../decorators/invalidate-cache.decorator';
import { UpdateProductDTO } from '@application/product/dto/update-product.dto';

@Controller({ path: 'products', version: '1' })
@UseInterceptors(CacheInterceptor)
export class ProductController {
  constructor(
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Get()
  @CacheKey('all_products')
  async getAllProducts() {
    return await this.getAllProductsUseCase.execute(undefined);
  }

  @Get(':id')
  @CacheKey('product:{{id}}')
  async getProduct(@Param('id') id: string) {
    return this.getProductByIdUseCase.execute(id);
  }

  @Post()
  @InvalidateCache('all_products')
  async createNewProduct(@Body() data: CreateProductDTO) {
    return await this.createProductUseCase.execute(data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @InvalidateCache('product:{{id}}, all_products')
  async updateProduct(@Param('id') id: string, @Body() data: UpdateProductDTO) {
    return this.updateProductUseCase.execute({ id, ...data });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @InvalidateCache('product:{{id}}, all_products')
  async deleteProduct(@Param('id') id: string) {
    return this.deleteProductUseCase.execute(id);
  }
}
