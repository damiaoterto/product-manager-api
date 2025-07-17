import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DeleteProductUseCase } from './delete-product.usecase';
import { ProductRepository } from '@domain/products/repositories/product.repository';
import { Product } from '@domain/products/entities/product.entity';
import { randomUUID } from 'node:crypto';

jest.mock('@domain/products/entities/product.entity');

const mockProductRepository = {
  findOneById: jest.fn(),
  delete: jest.fn(),
};

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductUseCase,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteProductUseCase>(DeleteProductUseCase);
    productRepository = module.get<ProductRepository>(ProductRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete the product when it exists', async () => {
      const productId = randomUUID();
      const existingProduct = { id: productId } as Product;

      mockProductRepository.findOneById.mockResolvedValue(existingProduct);
      mockProductRepository.delete.mockResolvedValue(undefined);

      await useCase.execute(productId);

      expect(productRepository.findOneById).toHaveBeenCalledWith(productId);
      expect(productRepository.delete).toHaveBeenCalledWith(productId);
    });

    it('should throw HttpException when the product does not exist', async () => {
      const productId = 'invalid-uuid';
      mockProductRepository.findOneById.mockResolvedValue(undefined);

      await expect(useCase.execute(productId)).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );

      expect(productRepository.findOneById).toHaveBeenCalledWith(productId);
      expect(productRepository.delete).not.toHaveBeenCalled();
    });
  });
});
