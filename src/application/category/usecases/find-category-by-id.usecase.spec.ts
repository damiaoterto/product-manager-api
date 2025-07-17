import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { Category } from '@domain/categories/entities/category.entity';
import { FindCategoryById } from './find-category-by-id.usecase';

const mockCategoryRepository = {
  findOneById: jest.fn(),
};

describe('FindCategoryById', () => {
  let useCase: FindCategoryById;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCategoryById,
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindCategoryById>(FindCategoryById);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a category when it is found', async () => {
      const categoryId = 'valid-uuid';
      const expectedCategory = {
        id: categoryId,
        name: 'Test Category',
        displayName: 'Test Category Display',
        createdAt: new Date(),
      } as Category;

      mockCategoryRepository.findOneById.mockResolvedValue(expectedCategory);

      const result = await useCase.execute(categoryId);

      expect(categoryRepository.findOneById).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(expectedCategory);
    });

    it('should throw HttpException when the category is not found', async () => {
      const categoryId = 'invalid-uuid';
      mockCategoryRepository.findOneById.mockResolvedValue(undefined);

      await expect(useCase.execute(categoryId)).rejects.toThrow(
        new HttpException('Category not found', HttpStatus.NOT_FOUND),
      );

      expect(categoryRepository.findOneById).toHaveBeenCalledWith(categoryId);
    });
  });
});
