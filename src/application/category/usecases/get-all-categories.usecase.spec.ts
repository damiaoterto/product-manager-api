import { Test, TestingModule } from '@nestjs/testing';
import { GetAllCategoriesUseCase } from './get-all-categories.usecase';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { Category } from '@domain/categories/entities/category.entity';

const mockCategoryRepository = {
  findAll: jest.fn(),
};

describe('GetAllCategoriesUseCase', () => {
  let useCase: GetAllCategoriesUseCase;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllCategoriesUseCase,
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllCategoriesUseCase>(GetAllCategoriesUseCase);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return an array of categories', async () => {
      const expectedCategories = [
        { id: 'uuid-1', name: 'Category 1' },
        { id: 'uuid-2', name: 'Category 2' },
      ] as Category[];

      mockCategoryRepository.findAll.mockResolvedValue(expectedCategories);

      const result = await useCase.execute(undefined);

      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategories);
      expect(result.length).toBe(2);
    });

    it('should return an empty array when no categories are found', async () => {
      mockCategoryRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute(undefined);

      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });
});
