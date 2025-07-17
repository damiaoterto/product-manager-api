import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CreateCategoryUseCase } from '@application/category/usecases/create-category.usecase';
import { FindCategoryById } from '@application/category/usecases/find-category-by-id.usecase';
import { CreateCategoryDTO } from '@application/category/dto/create-category.dto';
import { Category } from '@domain/categories/entities/category.entity';

const mockCreateCategoryUseCase = {
  execute: jest.fn(),
};

const mockFindCategoryById = {
  execute: jest.fn(),
};

describe('CategoryController', () => {
  let controller: CategoryController;
  let createUseCase: CreateCategoryUseCase;
  let findUseCase: FindCategoryById;

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
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    createUseCase = module.get<CreateCategoryUseCase>(CreateCategoryUseCase);
    findUseCase = module.get<FindCategoryById>(FindCategoryById);

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

  describe('findCategory', () => {
    it('should call the find use case and return a category', async () => {
      const categoryId = 'uuid-1';
      const expectedResult = { id: categoryId, name: 'Test' } as Category;
      mockFindCategoryById.execute.mockResolvedValue(expectedResult);

      const result = await controller.findCategory(categoryId);

      expect(findUseCase.execute).toHaveBeenCalledWith(categoryId);
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
      expect(findUseCase.execute).toHaveBeenCalledWith(categoryId);
    });
  });
});
