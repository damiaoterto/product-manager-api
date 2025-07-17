import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { Category } from '@domain/categories/entities/category.entity';
import { CreateCategoryUseCase } from './create-category.usecase';
import { CreateCategoryDTO } from '../dto/create-category.dto';

jest.mock('@domain/categories/entities/category.entity');

const mockCategoryRepository = {
  findOneByName: jest.fn(),
  createNew: jest.fn(),
};

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let categoryRepository: CategoryRepository;

  const mockCategoryEntity = {
    id: 'uuid-1',
    name: 'new-category',
    displayName: 'New Category',
    createdAt: new Date(),
  } as Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCategoryUseCase,
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateCategoryUseCase>(CreateCategoryUseCase);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);

    jest.clearAllMocks();

    (Category.create as jest.Mock).mockReturnValue(mockCategoryEntity);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create and return a new category if it does not exist', async () => {
      const createCategoryDto: CreateCategoryDTO = {
        name: 'new-category',
        displayName: 'New Category',
      };

      mockCategoryRepository.findOneByName.mockResolvedValue(undefined);

      mockCategoryRepository.createNew.mockResolvedValue(undefined);

      const result = await useCase.execute(createCategoryDto);

      expect(categoryRepository.findOneByName).toHaveBeenCalledWith(
        createCategoryDto.name,
      );

      expect(Category.create).toHaveBeenCalledWith(createCategoryDto);

      expect(categoryRepository.createNew).toHaveBeenCalledWith(
        mockCategoryEntity,
      );

      expect(result).toEqual(mockCategoryEntity);
    });

    it('should throw HttpException if the category already exists', async () => {
      const createCategoryDto: CreateCategoryDTO = {
        name: 'existing-category',
        displayName: 'Existing Category',
      };

      mockCategoryRepository.findOneByName.mockResolvedValue(
        mockCategoryEntity,
      );

      await expect(useCase.execute(createCategoryDto)).rejects.toThrow(
        new HttpException('Category already exists', HttpStatus.BAD_REQUEST),
      );

      expect(categoryRepository.findOneByName).toHaveBeenCalledWith(
        createCategoryDto.name,
      );
      expect(Category.create).not.toHaveBeenCalled();
      expect(categoryRepository.createNew).not.toHaveBeenCalled();
    });
  });
});
