import { Test, TestingModule } from '@nestjs/testing';
import { GetAllProductsUseCase } from './get-all-products.usecase';
import { ProductRepository } from '@domain/products/repositories/product.repository';
import { Product } from '@domain/products/entities/product.entity';

jest.mock('@domain/products/entities/product.entity');

const mockProductRepository = {
  findAll: jest.fn(),
};

describe('GetAllProductsUseCase', () => {
  let useCase: GetAllProductsUseCase;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllProductsUseCase,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllProductsUseCase>(GetAllProductsUseCase);
    productRepository = module.get<ProductRepository>(ProductRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [
        { id: 'uuid-1', name: 'Product 1' },
        { id: 'uuid-2', name: 'Product 2' },
      ] as Product[];

      mockProductRepository.findAll.mockResolvedValue(expectedProducts);

      const result = await useCase.execute(undefined);

      expect(productRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });

    it('should return an empty array when no products are found', async () => {
      mockProductRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute(undefined);

      expect(productRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
