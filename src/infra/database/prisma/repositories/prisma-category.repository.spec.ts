import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@generated/prisma';
import { PrismaCategoryRepository } from './prisma-category.repository';
import { Category } from '@domain/categories/entities/category.entity';

jest.mock('@domain/categories/entities/category.entity');

describe('PrismaCategoryRepository', () => {
  let repository: PrismaCategoryRepository;
  let prismaClient: PrismaClient;

  const mockPrismaClient = {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCategoryEntity = {
    id: 'uuid-1',
    name: 'tech',
    displayName: 'Technology',
    createdAt: new Date(),
  } as Category;

  const mockRawCategory = {
    id: 'uuid-1',
    name: 'tech',
    displayName: 'Technology',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCategoryRepository,
        {
          provide: PrismaClient,
          useValue: mockPrismaClient,
        },
      ],
    }).compile();

    repository = module.get<PrismaCategoryRepository>(PrismaCategoryRepository);
    prismaClient = module.get<PrismaClient>(PrismaClient);

    jest.clearAllMocks();

    (Category.create as jest.Mock).mockReturnValue(mockCategoryEntity);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      mockPrismaClient.category.findMany.mockResolvedValue([mockRawCategory]);

      const result = await repository.findAll();

      expect(prismaClient.category.findMany).toHaveBeenCalledTimes(1);
      expect(Category.create).toHaveBeenCalledWith(mockRawCategory);
      expect(result).toEqual([mockCategoryEntity]);
    });
  });

  describe('findOneById', () => {
    it('should return a category if found', async () => {
      mockPrismaClient.category.findUnique.mockResolvedValue(mockRawCategory);

      const result = await repository.findOneById('uuid-1');

      expect(prismaClient.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(Category.create).toHaveBeenCalledWith(mockRawCategory);
      expect(result).toEqual(mockCategoryEntity);
    });

    it('should return undefined if category not found', async () => {
      mockPrismaClient.category.findUnique.mockResolvedValue(null);

      const result = await repository.findOneById('uuid-not-found');

      expect(result).toBeUndefined();
      expect(Category.create).not.toHaveBeenCalled();
    });
  });

  describe('findOneByName', () => {
    it('should return a category if found by name', async () => {
      const categoryName = 'tech';
      mockPrismaClient.category.findUnique.mockResolvedValue(mockRawCategory);

      const result = await repository.findOneByName(categoryName);

      expect(prismaClient.category.findUnique).toHaveBeenCalledWith({
        where: { name: categoryName },
      });
      expect(Category.create).toHaveBeenCalledWith(mockRawCategory);
      expect(result).toEqual(mockCategoryEntity);
    });

    it('should return undefined if category is not found by name', async () => {
      mockPrismaClient.category.findUnique.mockResolvedValue(null);

      const result = await repository.findOneByName('non-existent-name');

      expect(result).toBeUndefined();
      expect(Category.create).not.toHaveBeenCalled();
    });
  });

  describe('createNew', () => {
    it('should create a new category', async () => {
      const newCategory = {
        id: 'uuid-2',
        name: 'books',
        displayName: 'Books',
        createdAt: new Date(),
      } as Category;

      await repository.createNew(newCategory);

      expect(prismaClient.category.create).toHaveBeenCalledWith({
        data: {
          id: newCategory.id,
          name: newCategory.name,
          displayName: newCategory.displayName,
          createdAt: newCategory.createdAt,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a category if it exists', async () => {
      mockPrismaClient.category.findUnique.mockResolvedValue(mockRawCategory);
      const updateData = { displayName: 'New Technology Name' };

      await repository.update('uuid-1', updateData);

      expect(prismaClient.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(prismaClient.category.update).toHaveBeenCalledWith({
        where: { id: mockCategoryEntity.id },
        data: updateData,
      });
    });

    it('should throw an error if category to update is not found', async () => {
      mockPrismaClient.category.findUnique.mockResolvedValue(null);

      await expect(repository.update('uuid-not-found', {})).rejects.toThrow(
        'Category not found',
      );
      expect(prismaClient.category.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a category if it exists', async () => {
      mockPrismaClient.category.findUnique.mockResolvedValue(mockRawCategory);

      await repository.delete('uuid-1');

      expect(prismaClient.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(prismaClient.category.delete).toHaveBeenCalledWith({
        where: { id: mockCategoryEntity.id },
      });
    });

    it('should throw an error if category to delete is not found', async () => {
      mockPrismaClient.category.findUnique.mockResolvedValue(null);

      await expect(repository.delete('uuid-not-found')).rejects.toThrow(
        'Category not found',
      );
      expect(prismaClient.category.delete).not.toHaveBeenCalled();
    });
  });
});
