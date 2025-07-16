import { describe, beforeEach, expect, it } from '@jest/globals';
import { ProductRepository } from './product.repository';
import { InMemoryProductRepository } from './in-memory-product.repository';
import { Product } from '../entities/product.entity';

describe('Product Repository', () => {
  let repository: ProductRepository;

  const productData = {
    name: 'Apple',
    description: 'Fruit Apple',
    price: 1.3,
  };

  beforeEach(() => {
    repository = new InMemoryProductRepository();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a new product register', async () => {
    const product = Product.create(productData);
    const createSpyOn = jest.spyOn(repository, 'createNew');

    await repository.createNew(product);

    expect(createSpyOn).toHaveBeenCalledTimes(1);
  });

  it('should be get all products registries', async () => {
    const productOne = Product.create(productData);
    const productTwo = Product.create(productData);

    await Promise.all([
      repository.createNew(productOne),
      repository.createNew(productTwo),
    ]);

    const spyFindAll = jest.spyOn(repository, 'findAll');

    const products = await repository.findAll();

    expect(spyFindAll).toHaveBeenCalled();
    expect(spyFindAll).toHaveBeenCalledTimes(1);
    expect(products).toHaveLength(2);
  });

  it('should be find a product by id', async () => {
    const product = Product.create(productData);

    const spyFindOneById = jest.spyOn(repository, 'findOneById');
    await repository.createNew(product);

    const createdProduct = await repository.findOneById(product.id!);

    expect(spyFindOneById).toHaveBeenCalled();
    expect(spyFindOneById).toHaveBeenCalledTimes(1);
    expect(createdProduct).toBeDefined();
    expect(createdProduct).toBe(product);
  });

  it('should be update a product register', async () => {
    const newPrice = 34.6;
    const updateData = {
      price: newPrice,
    };
    const product = Product.create(productData);

    const spyUpdate = jest.spyOn(repository, 'update');
    await repository.createNew(product);

    await repository.update(product.id!, updateData);

    expect(spyUpdate).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(spyUpdate).toHaveBeenCalledWith(product.id!, updateData);
  });

  it('should return exception if not found product to delete', async () => {
    try {
      await repository.update('abc123', { price: 12.9 });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Product not found');
    }
  });

  it('should be delete a product register', async () => {
    const product = Product.create(productData);

    const spyUpdate = jest.spyOn(repository, 'delete');
    await repository.createNew(product);

    await repository.delete(product.id!);

    expect(spyUpdate).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(spyUpdate).toHaveBeenCalledWith(product.id!);
  });

  it('should return exception if not found product to delete', async () => {
    try {
      await repository.delete('abc123');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Product not found');
    }
  });
});
