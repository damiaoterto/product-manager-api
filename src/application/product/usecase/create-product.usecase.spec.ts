import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductUseCase } from './create-product.usecase';
import { ProductRepository } from '@domain/products/repositories/product.repository';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { Product } from '@domain/products/entities/product.entity';
import { Category } from '@domain/categories/entities/category.entity';
import { CreateProductDTO } from '../dto/create-product.dto';
import { randomUUID } from 'node:crypto';

jest.mock('@domain/products/entities/product.entity');
jest.mock('@domain/categories/entities/category.entity');

const mockProductRepository = {
  createNew: jest.fn(),
};

const mockCategoryRepository = {
  findOneByName: jest.fn(),
};

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;

  const mockCategory = {
    id: randomUUID(),
    name: 'electronics',
    displayName: 'Electronics',
  } as Category;

  const mockProduct = {
    id: randomUUID(),
    name: 'New Product',
    description: 'Product Description',
    price: 99.99,
    categories: [mockCategory],
  } as Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        { provide: ProductRepository, useValue: mockProductRepository },
        { provide: CategoryRepository, useValue: mockCategoryRepository },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    jest.clearAllMocks();

    (Product.create as jest.Mock).mockReturnValue(mockProduct);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a product successfully when all categories exist', async () => {
      const createDto: CreateProductDTO = {
        name: 'New Product',
        description: 'Product Description',
        price: 99.99,
        categories: ['electronics'],
      };

      mockCategoryRepository.findOneByName.mockResolvedValue(mockCategory);
      mockProductRepository.createNew.mockResolvedValue(undefined);

      const result = await useCase.execute(createDto);

      expect(mockCategoryRepository.findOneByName).toHaveBeenCalledWith(
        'electronics',
      );
      expect(Product.create).toHaveBeenCalledWith({
        name: createDto.name,
        description: createDto.description,
        price: createDto.price,
        categories: [mockCategory],
      });
      expect(mockProductRepository.createNew).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });

    it('should throw HttpException if a category is not found', async () => {
      const createDto: CreateProductDTO = {
        name: 'New Product',
        description: 'Product Description',
        price: 99.99,
        categories: ['electronics', 'non-existent-category'],
      };

      mockCategoryRepository.findOneByName
        .mockResolvedValueOnce(mockCategory)
        .mockResolvedValueOnce(undefined);

      await expect(useCase.execute(createDto)).rejects.toThrow(
        new HttpException(
          `Category 'non-existent-category' not found`,
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(mockCategoryRepository.findOneByName).toHaveBeenCalledTimes(2);
      expect(Product.create).not.toHaveBeenCalled();
      expect(mockProductRepository.createNew).not.toHaveBeenCalled();
    });
  });
});
