import { describe, beforeEach, it, expect } from '@jest/globals';
import { InMemoryCategoryRepository } from './in-memory-category.repository';
import { CategoryRepository } from './category.repository';
import { Category } from '../entities/category.entity';

describe('Category Repository', () => {
  let repository: CategoryRepository;

  const categoryData = {
    name: 'electronic',
    displayName: 'Electronic',
  };

  beforeEach(() => {
    repository = new InMemoryCategoryRepository();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a new category register', async () => {
    const category = Category.create(categoryData);
    const createSpyOn = jest.spyOn(repository, 'createNew');

    await repository.createNew(category);

    expect(createSpyOn).toHaveBeenCalledTimes(1);
  });

  it('should be get all products registries', async () => {
    const categoryOne = Category.create(categoryData);
    const categoryTwo = Category.create(categoryData);

    await Promise.all([
      repository.createNew(categoryOne),
      repository.createNew(categoryTwo),
    ]);

    const spyFindAll = jest.spyOn(repository, 'findAll');

    const categories = await repository.findAll();

    expect(spyFindAll).toHaveBeenCalled();
    expect(spyFindAll).toHaveBeenCalledTimes(1);
    expect(categories).toHaveLength(2);
  });

  it('should be find a category by id', async () => {
    const category = Category.create(categoryData);

    const spyFindOneById = jest.spyOn(repository, 'findOneById');
    await repository.createNew(category);

    const createdProduct = await repository.findOneById(category.id!);

    expect(spyFindOneById).toHaveBeenCalled();
    expect(spyFindOneById).toHaveBeenCalledTimes(1);
    expect(createdProduct).toBeDefined();
    expect(createdProduct).toBe(category);
  });

  it('should be update a category register', async () => {
    const name = 'electro';
    const updateData = {
      name,
    };
    const category = Category.create(categoryData);

    const spyUpdate = jest.spyOn(repository, 'update');
    await repository.createNew(category);

    await repository.update(category.id!, updateData);

    expect(spyUpdate).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(spyUpdate).toHaveBeenCalledWith(category.id!, updateData);
  });

  it('should return exception if not found category to delete', async () => {
    try {
      await repository.update('abc123', { name: 'Elect' });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Category not found');
    }
  });

  it('should be delete a product register', async () => {
    const category = Category.create(categoryData);

    const spyUpdate = jest.spyOn(repository, 'delete');
    await repository.createNew(category);

    await repository.delete(category.id!);

    expect(spyUpdate).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(spyUpdate).toHaveBeenCalledWith(category.id!);
  });

  it('should return exception if not found category to delete', async () => {
    try {
      await repository.delete('abc123');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Category not found');
    }
  });
});
