import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryUseCase } from '@application/category/usecases/create-category.usecase';
import { CreateCategoryDTO } from '@application/category/dto/create-category.dto';
import { Category } from '@domain/categories/entities/category.entity';
import { CategoryController } from './category.controller';

const mockCreateCategoryUseCase = {
  execute: jest.fn(),
};

describe('CategoryController', () => {
  let controller: CategoryController;
  let useCase: CreateCategoryUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],

      providers: [
        {
          provide: CreateCategoryUseCase,
          useValue: mockCreateCategoryUseCase,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    useCase = module.get<CreateCategoryUseCase>(CreateCategoryUseCase);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createNewCategory', () => {
    it('should call the use case with the correct data and return a category', async () => {
      const createDto: CreateCategoryDTO = {
        name: 'electronics',
        displayName: 'Electronics',
      };
      const expectedResult = {
        id: 'some-uuid',
        ...createDto,
        createdAt: new Date(),
      } as Category;

      mockCreateCategoryUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.createNewCategory(createDto);

      expect(useCase.execute).toHaveBeenCalledWith(createDto);

      expect(result).toEqual(expectedResult);
    });

    it('should propagate exceptions thrown by the use case', async () => {
      const createDto: CreateCategoryDTO = {
        name: 'electronics',
        displayName: 'Electronics',
      };
      const expectedError = new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST,
      );

      mockCreateCategoryUseCase.execute.mockRejectedValue(expectedError);

      await expect(controller.createNewCategory(createDto)).rejects.toThrow(
        expectedError,
      );
      expect(useCase.execute).toHaveBeenCalledWith(createDto);
    });
  });
});
