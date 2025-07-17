import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProductRepository } from '@domain/products/repositories/product.repository';
import { Product } from '@domain/products/entities/product.entity';
import { randomUUID } from 'node:crypto';
import { GetProductByIdUseCase } from './get-product-by-id.usecase';

jest.mock('@domain/products/entities/product.entity');

const mockProductRepository = {
  findOneById: jest.fn(),
};

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductByIdUseCase,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetProductByIdUseCase>(GetProductByIdUseCase);
    productRepository = module.get<ProductRepository>(ProductRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a product when it is found', async () => {
      const productId = randomUUID();
      const expectedProduct = {
        id: productId,
        name: 'Test Product',
      } as Product;

      mockProductRepository.findOneById.mockResolvedValue(expectedProduct);

      const result = await useCase.execute(productId);

      expect(productRepository.findOneById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(expectedProduct);
    });

    it('should throw HttpException when the product is not found', async () => {
      const productId = 'invalid-uuid';
      mockProductRepository.findOneById.mockResolvedValue(undefined);

      await expect(useCase.execute(productId)).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );

      expect(productRepository.findOneById).toHaveBeenCalledWith(productId);
    });
  });
});
