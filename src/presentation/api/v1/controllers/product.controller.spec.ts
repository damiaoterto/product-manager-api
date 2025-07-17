import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProductController } from './product.controller';
import { CreateProductUseCase } from '@application/product/usecase/create-product.usecase';
import { DeleteProductUseCase } from '@application/product/usecase/delete-product.usecase';
import { GetAllProductsUseCase } from '@application/product/usecase/get-all-products.usecase';
import { GetProductByIdUseCase } from '@application/product/usecase/get-product-by-id.usecase';
import { UpdateProductUseCase } from '@application/product/usecase/update-product.usecase';
import { CreateProductDTO } from '@application/product/dto/create-product.dto';
import { UpdateProductDTO } from '@application/product/dto/update-product.dto';
import { Product } from '@domain/products/entities/product.entity';
import { randomUUID } from 'node:crypto';
import { CacheInterceptor } from '../interceptors/cache.interceptor';

const mockGetAllProductsUseCase = { execute: jest.fn() };
const mockGetProductByIdUseCase = { execute: jest.fn() };
const mockCreateProductUseCase = { execute: jest.fn() };
const mockUpdateProductUseCase = { execute: jest.fn() };
const mockDeleteProductUseCase = { execute: jest.fn() };

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: GetAllProductsUseCase, useValue: mockGetAllProductsUseCase },
        { provide: GetProductByIdUseCase, useValue: mockGetProductByIdUseCase },
        { provide: CreateProductUseCase, useValue: mockCreateProductUseCase },
        { provide: UpdateProductUseCase, useValue: mockUpdateProductUseCase },
        { provide: DeleteProductUseCase, useValue: mockDeleteProductUseCase },
      ],
    })

      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: jest.fn().mockImplementation((_, next) => next.handle()),
      })
      .compile();

    controller = module.get<ProductController>(ProductController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should call GetAllProductsUseCase and return an array of products', async () => {
      const expectedResult = [{ id: randomUUID() }] as Product[];
      mockGetAllProductsUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.getAllProducts();

      expect(mockGetAllProductsUseCase.execute).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProduct', () => {
    it('should call GetProductByIdUseCase and return a product', async () => {
      const productId = randomUUID();
      const expectedResult = { id: productId } as Product;
      mockGetProductByIdUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.getProduct(productId);

      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledWith(productId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createNewProduct', () => {
    it('should call CreateProductUseCase and return the created product', async () => {
      const createDto: CreateProductDTO = {
        name: 'New Product',
        description: 'Description',
        price: 100,
        categories: ['cat1'],
      };
      const expectedResult = { id: randomUUID() } as Product;
      mockCreateProductUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.createNewProduct(createDto);

      expect(mockCreateProductUseCase.execute).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateProduct', () => {
    it('should call UpdateProductUseCase with correct data', async () => {
      const productId = randomUUID();
      const updateDto: UpdateProductDTO = { name: 'Updated Product' };
      mockUpdateProductUseCase.execute.mockResolvedValue(undefined);

      await controller.updateProduct(productId, updateDto);

      expect(mockUpdateProductUseCase.execute).toHaveBeenCalledWith({
        id: productId,
        ...updateDto,
      });
    });

    it('should propagate exceptions from UpdateProductUseCase', async () => {
      const productId = 'not-found-id';
      const updateDto: UpdateProductDTO = { name: 'Updated Product' };
      const expectedError = new HttpException(
        'Product not found',
        HttpStatus.NOT_FOUND,
      );
      mockUpdateProductUseCase.execute.mockRejectedValue(expectedError);

      await expect(
        controller.updateProduct(productId, updateDto),
      ).rejects.toThrow(expectedError);
    });
  });

  describe('deleteProduct', () => {
    it('should call DeleteProductUseCase with the correct id', async () => {
      const productId = randomUUID();
      mockDeleteProductUseCase.execute.mockResolvedValue(undefined);

      await controller.deleteProduct(productId);

      expect(mockDeleteProductUseCase.execute).toHaveBeenCalledWith(productId);
    });

    it('should propagate exceptions from DeleteProductUseCase', async () => {
      const productId = 'not-found-id';
      const expectedError = new HttpException(
        'Product not found',
        HttpStatus.NOT_FOUND,
      );
      mockDeleteProductUseCase.execute.mockRejectedValue(expectedError);

      await expect(controller.deleteProduct(productId)).rejects.toThrow(
        expectedError,
      );
    });
  });
});
