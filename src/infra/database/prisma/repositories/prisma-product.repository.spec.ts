import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@generated/prisma';
import { PrismaProductRepository } from './prisma-product.repository';
import { Product } from '@domain/products/entities/product.entity';
import { Category } from '@domain/categories/entities/category.entity';
import { randomUUID } from 'node:crypto';

jest.mock('@domain/products/entities/product.entity');
jest.mock('@domain/categories/entities/category.entity');

describe('PrismaProductRepository', () => {
  let repository: PrismaProductRepository;
  let prismaClient: PrismaClient;

  const mockPrismaClient = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },

    category: {
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCategoryEntity = {
    id: randomUUID().toString(),
    name: 'electronics',
    displayName: 'Electronics',
  } as Category;

  const mockProductEntity = {
    id: 'product-uuid-1',
    name: 'Laptop Pro',
    description: 'A powerful laptop',
    price: 4999.99,
    categories: [mockCategoryEntity],
    createdAt: new Date(),
  } as Product;

  const mockRawProduct = {
    id: 'product-uuid-1',
    name: 'Laptop Pro',
    description: 'A powerful laptop',
    price: {
      toNumber: () => 4999.99,
    },
    categories: [
      {
        id: mockCategoryEntity.id,
        name: 'electronics',
        displayName: 'Electronics',
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
  };

  beforeEach(async () => {
    (Category.create as jest.Mock).mockReturnValue(mockCategoryEntity);

    (Product.create as jest.Mock).mockReturnValue(mockProductEntity);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaProductRepository,
        {
          provide: PrismaClient,
          useValue: mockPrismaClient,
        },
      ],
    }).compile();

    repository = module.get<PrismaProductRepository>(PrismaProductRepository);
    prismaClient = module.get<PrismaClient>(PrismaClient);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products including categories', async () => {
      mockPrismaClient.product.findMany.mockResolvedValue([mockRawProduct]);

      const result = await repository.findAll();

      expect(prismaClient.product.findMany).toHaveBeenCalledWith({
        include: { categories: true },
      });
      expect(Category.create).toHaveBeenCalledWith(
        mockRawProduct.categories[0],
      );
      expect(Product.create).toHaveBeenCalledWith({
        ...mockRawProduct,
        price: 4999.99,
        categories: [mockCategoryEntity],
      });
      expect(result).toEqual([mockProductEntity]);
    });
  });

  describe('findOneById', () => {
    it('should return a product with categories if found', async () => {
      mockPrismaClient.product.findUnique.mockResolvedValue(mockRawProduct);

      const result = await repository.findOneById('product-uuid-1');

      expect(prismaClient.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-uuid-1' },
        include: { categories: true },
      });
      expect(Category.create).toHaveBeenCalledWith(
        mockRawProduct.categories[0],
      );
      expect(Product.create).toHaveBeenCalledWith({
        ...mockRawProduct,
        price: 4999.99,
        categories: [mockCategoryEntity],
      });
      expect(result).toEqual(mockProductEntity);
    });

    it('should return undefined if product not found', async () => {
      mockPrismaClient.product.findUnique.mockResolvedValue(null);
      const result = await repository.findOneById('not-found');
      expect(result).toBeUndefined();
    });
  });

  describe('createNew', () => {
    it('should create a new product and connect its categories', async () => {
      await repository.createNew(mockProductEntity);

      expect(prismaClient.product.create).toHaveBeenCalledWith({
        data: {
          id: mockProductEntity.id,
          name: mockProductEntity.name,
          description: mockProductEntity.description,
          price: mockProductEntity.price,
          categories: {
            connect: [{ id: mockProductEntity.categories[0].id! }],
          },
        },
      });
    });
  });

  describe('update', () => {
    it('should throw an error if product to update is not found', async () => {
      mockPrismaClient.product.findUnique.mockResolvedValue(null);
      await expect(
        repository.update('not-found', { name: 'New Name' }),
      ).rejects.toThrow('Product not found');
    });

    it('should attempt to update a product if it exists', async () => {
      mockPrismaClient.product.findUnique.mockResolvedValue(mockRawProduct);
      const updateData = { name: 'Laptop Pro v2' };
      await repository.update('product-uuid-1', updateData);
      expect(prismaClient.category.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should throw an error if product to delete is not found', async () => {
      mockPrismaClient.product.findUnique.mockResolvedValue(null);
      await expect(repository.delete('not-found')).rejects.toThrow(
        'Product not found',
      );
    });

    it('should attempt to delete a product if it exists', async () => {
      mockPrismaClient.product.findUnique.mockResolvedValue(mockRawProduct);
      await repository.delete('product-uuid-1');
      expect(prismaClient.category.delete).toHaveBeenCalled();
    });
  });
});
