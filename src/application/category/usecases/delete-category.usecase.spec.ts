import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { Category } from '@domain/categories/entities/category.entity';
import { DeleteCategoryUseCase } from './delete-category.usecase';

const mockCategoryRepository = {
  findOneById: jest.fn(),
  delete: jest.fn(),
};

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCategoryUseCase,
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteCategoryUseCase>(DeleteCategoryUseCase);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete the category when it exists', async () => {
      const categoryId = 'valid-uuid';
      const existingCategory = { id: categoryId } as Category;

      mockCategoryRepository.findOneById.mockResolvedValue(existingCategory);
      mockCategoryRepository.delete.mockResolvedValue(undefined);

      await useCase.execute(categoryId);

      expect(categoryRepository.findOneById).toHaveBeenCalledWith(categoryId);
      expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);
    });

    it('should throw HttpException when the category does not exist', async () => {
      const categoryId = 'invalid-uuid';
      mockCategoryRepository.findOneById.mockResolvedValue(undefined);

      await expect(useCase.execute(categoryId)).rejects.toThrow(
        new HttpException('Category not found', HttpStatus.NOT_FOUND),
      );

      expect(categoryRepository.findOneById).toHaveBeenCalledWith(categoryId);
      expect(categoryRepository.delete).not.toHaveBeenCalled();
    });
  });
});
