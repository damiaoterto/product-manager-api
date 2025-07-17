import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CreateCategoryUseCase } from '@application/category/usecases/create-category.usecase';
import { FindCategoryById } from '@application/category/usecases/find-category-by-id.usecase';
import { GetAllCategoriesUseCase } from '@application/category/usecases/get-all-categories.usecase';
import { CreateCategoryDTO } from '@application/category/dto/create-category.dto';
import { Category } from '@domain/categories/entities/category.entity';

// 1. Mock de todos os UseCases que são dependências do controller
const mockCreateCategoryUseCase = {
  execute: jest.fn(),
};

const mockFindCategoryById = {
  execute: jest.fn(),
};

const mockGetAllCategoriesUseCase = {
  execute: jest.fn(),
};

describe('CategoryController', () => {
  let controller: CategoryController;
  let createUseCase: CreateCategoryUseCase;
  let findByIdUseCase: FindCategoryById;
  let getAllUseCase: GetAllCategoriesUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CreateCategoryUseCase,
          useValue: mockCreateCategoryUseCase,
        },
        {
          provide: FindCategoryById,
          useValue: mockFindCategoryById,
        },
        {
          provide: GetAllCategoriesUseCase,
          useValue: mockGetAllCategoriesUseCase,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    createUseCase = module.get<CreateCategoryUseCase>(CreateCategoryUseCase);
    findByIdUseCase = module.get<FindCategoryById>(FindCategoryById);
    getAllUseCase = module.get<GetAllCategoriesUseCase>(
      GetAllCategoriesUseCase,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createNewCategory', () => {
    it('should call the create use case and return a new category', async () => {
      const createDto: CreateCategoryDTO = {
        name: 'electronics',
        displayName: 'Electronics',
      };
      const expectedResult = { id: 'uuid-1' } as Category;
      mockCreateCategoryUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.createNewCategory(createDto);

      expect(createUseCase.execute).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllCategories', () => {
    it('should call the get all use case and return an array of categories', async () => {
      const expectedResult = [{ id: 'uuid-1' }, { id: 'uuid-2' }] as Category[];
      mockGetAllCategoriesUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.getAllCategories();

      expect(getAllUseCase.execute).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findCategory', () => {
    it('should call the find use case and return a category', async () => {
      const categoryId = 'uuid-1';
      const expectedResult = { id: categoryId, name: 'Test' } as Category;
      mockFindCategoryById.execute.mockResolvedValue(expectedResult);

      const result = await controller.findCategory(categoryId);

      expect(findByIdUseCase.execute).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate HttpException when category is not found', async () => {
      const categoryId = 'not-found-uuid';
      const expectedError = new HttpException(
        'Category not found',
        HttpStatus.NOT_FOUND,
      );
      mockFindCategoryById.execute.mockRejectedValue(expectedError);

      await expect(controller.findCategory(categoryId)).rejects.toThrow(
        expectedError,
      );
      expect(findByIdUseCase.execute).toHaveBeenCalledWith(categoryId);
    });
  });
});
