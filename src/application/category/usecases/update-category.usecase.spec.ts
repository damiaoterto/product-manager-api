import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateCategoryUseCase } from './update-category.usecase';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { Category } from '@domain/categories/entities/category.entity';
import { UpdateCategoryDTO } from '../dto/update-category.dto';

const mockCategoryRepository = {
  findOneById: jest.fn(),
  update: jest.fn(),
};

type UpdateData = UpdateCategoryDTO & { id: string };

describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCategoryUseCase,
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateCategoryUseCase>(UpdateCategoryUseCase);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update the category when it exists', async () => {
      const updateData: UpdateData = {
        id: 'valid-uuid',
        name: 'Updated Name',
        displayName: 'Updated Display Name',
      };

      const existingCategory = { id: 'valid-uuid' } as Category;
      mockCategoryRepository.findOneById.mockResolvedValue(existingCategory);
      mockCategoryRepository.update.mockResolvedValue(undefined);

      await useCase.execute(updateData);

      expect(categoryRepository.findOneById).toHaveBeenCalledWith(
        updateData.id,
      );
      expect(categoryRepository.update).toHaveBeenCalledWith(updateData.id, {
        name: updateData.name,
        displayName: updateData.displayName,
      });
    });

    it('should throw HttpException when the category does not exist', async () => {
      const updateData: UpdateData = {
        id: 'invalid-uuid',
        name: 'Updated Name',
        displayName: 'Updated Display Name',
      };

      mockCategoryRepository.findOneById.mockResolvedValue(undefined);

      await expect(useCase.execute(updateData)).rejects.toThrow(
        new HttpException('Category not exists', HttpStatus.NOT_FOUND),
      );

      expect(categoryRepository.findOneById).toHaveBeenCalledWith(
        updateData.id,
      );
      expect(categoryRepository.update).not.toHaveBeenCalled();
    });
  });
});
