import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CreateCategoryUseCase } from '@application/category/usecases/create-category.usecase';
import { FindCategoryById } from '@application/category/usecases/find-category-by-id.usecase';
import { GetAllCategoriesUseCase } from '@application/category/usecases/get-all-categories.usecase';
import { UpdateCategoryUseCase } from '@application/category/usecases/update-category.usecase';
import { DeleteCategoryUseCase } from '@application/category/usecases/delete-category.usecase';
import { CreateCategoryDTO } from '@application/category/dto/create-category.dto';
import { UpdateCategoryDTO } from '@application/category/dto/update-category.dto';
import { Category } from '@domain/categories/entities/category.entity';
import { CacheInterceptor } from '../interceptors/cache.interceptor';

const mockCreateCategoryUseCase = {
  execute: jest.fn(),
};

const mockFindCategoryById = {
  execute: jest.fn(),
};

const mockGetAllCategoriesUseCase = {
  execute: jest.fn(),
};

const mockUpdateCategoryUseCase = {
  execute: jest.fn(),
};

const mockDeleteCategoryUseCase = {
  execute: jest.fn(),
};

describe('CategoryController', () => {
  let controller: CategoryController;
  let createUseCase: CreateCategoryUseCase;
  let findByIdUseCase: FindCategoryById;
  let getAllUseCase: GetAllCategoriesUseCase;
  let updateUseCase: UpdateCategoryUseCase;
  let deleteUseCase: DeleteCategoryUseCase;

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
        {
          provide: UpdateCategoryUseCase,
          useValue: mockUpdateCategoryUseCase,
        },
        {
          provide: DeleteCategoryUseCase,
          useValue: mockDeleteCategoryUseCase,
        },
      ],
    })

      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: jest.fn().mockImplementation((_, next) => next.handle()),
      })
      .compile();

    controller = module.get<CategoryController>(CategoryController);
    createUseCase = module.get<CreateCategoryUseCase>(CreateCategoryUseCase);
    findByIdUseCase = module.get<FindCategoryById>(FindCategoryById);
    getAllUseCase = module.get<GetAllCategoriesUseCase>(
      GetAllCategoriesUseCase,
    );
    updateUseCase = module.get<UpdateCategoryUseCase>(UpdateCategoryUseCase);
    deleteUseCase = module.get<DeleteCategoryUseCase>(DeleteCategoryUseCase);

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

  describe('updateCategory', () => {
    it('should call the update use case with the correct data', async () => {
      const categoryId = 'uuid-1';
      const updateDto: UpdateCategoryDTO = { name: 'Updated Name' };
      mockUpdateCategoryUseCase.execute.mockResolvedValue(undefined);

      await controller.updateCategory(categoryId, updateDto);

      expect(updateUseCase.execute).toHaveBeenCalledWith({
        id: categoryId,
        ...updateDto,
      });
    });

    it('should propagate HttpException when category to update is not found', async () => {
      const categoryId = 'not-found-uuid';
      const updateDto: UpdateCategoryDTO = { name: 'Updated Name' };
      const expectedError = new HttpException(
        'Category not exists',
        HttpStatus.NOT_FOUND,
      );
      mockUpdateCategoryUseCase.execute.mockRejectedValue(expectedError);

      await expect(
        controller.updateCategory(categoryId, updateDto),
      ).rejects.toThrow(expectedError);

      expect(updateUseCase.execute).toHaveBeenCalledWith({
        id: categoryId,
        ...updateDto,
      });
    });
  });

  describe('DeleteCategory', () => {
    it('should call the delete use case with the correct id', async () => {
      const categoryId = 'uuid-to-delete';
      mockDeleteCategoryUseCase.execute.mockResolvedValue(undefined);

      await controller.DeleteCategory(categoryId);

      expect(deleteUseCase.execute).toHaveBeenCalledWith(categoryId);
    });

    it('should propagate HttpException when category to delete is not found', async () => {
      const categoryId = 'not-found-uuid';
      const expectedError = new HttpException(
        'Category not found',
        HttpStatus.NOT_FOUND,
      );
      mockDeleteCategoryUseCase.execute.mockRejectedValue(expectedError);

      await expect(controller.DeleteCategory(categoryId)).rejects.toThrow(
        expectedError,
      );

      expect(deleteUseCase.execute).toHaveBeenCalledWith(categoryId);
    });
  });
});
