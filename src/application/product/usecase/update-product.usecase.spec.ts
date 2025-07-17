import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProductRepository } from '@domain/products/repositories/product.repository';
import { Product } from '@domain/products/entities/product.entity';
import { randomUUID } from 'node:crypto';
import { UpdateProductUseCase } from './update-product.usecase';
import { UpdateProductDTO } from '../dto/update-product.dto';

jest.mock('@domain/products/entities/product.entity');

const mockProductRepository = {
  findOneById: jest.fn(),
  update: jest.fn(),
};

type UpdateData = UpdateProductDTO & { id: string };

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductUseCase,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateProductUseCase>(UpdateProductUseCase);
    productRepository = module.get<ProductRepository>(ProductRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update the product when it exists', async () => {
      const updateData: UpdateData = {
        id: randomUUID(),
        name: 'Updated Name',
        price: 150.5,
        description: 'Updated Description',
      };
      const existingProduct = { id: updateData.id } as Product;

      mockProductRepository.findOneById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(undefined);

      await useCase.execute(updateData);

      expect(productRepository.findOneById).toHaveBeenCalledWith(updateData.id);
      expect(productRepository.update).toHaveBeenCalledWith(updateData.id, {
        name: updateData.name,
        price: updateData.price,
        description: updateData.description,
      });
    });

    it('should throw HttpException when the product does not exist', async () => {
      const updateData: UpdateData = {
        id: 'invalid-uuid',
        name: 'Updated Name',
      };

      mockProductRepository.findOneById.mockResolvedValue(undefined);

      await expect(useCase.execute(updateData)).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );

      expect(productRepository.findOneById).toHaveBeenCalledWith(updateData.id);
      expect(productRepository.update).not.toHaveBeenCalled();
    });
  });
});
