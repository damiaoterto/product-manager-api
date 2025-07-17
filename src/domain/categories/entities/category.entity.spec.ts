import { randomUUID } from 'node:crypto';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { Category } from './category.entity';

describe('Category Entity', () => {
  let category: Category;

  beforeEach(() => {
    category = new Category();
  });

  it('should be defined', () => {
    expect(category).toBeDefined();
  });

  describe('Attribute Definition', () => {
    it('should define name attribute', () => {
      const name = 'electronic';

      category.name = name;

      expect(category.name).toBeDefined();
      expect(category.name).toBe(name);
    });

    it('should define name attribute', () => {
      const displayName = 'Electronic';

      category.displayName = displayName;

      expect(category.displayName).toBeDefined();
      expect(category.displayName).toBe(displayName);
    });
  });

  describe('Factory Method', () => {
    it('should create a category entity instance', () => {
      const data = {
        name: 'electronic',
        displayName: 'Electronic',
      };

      const category = Category.create(data);

      expect(category).toBeDefined();
    });

    it('should create a product entity instance with all attrs', () => {
      const currentDate = new Date();
      const data = {
        id: randomUUID().toString(),
        name: 'electronic',
        displayName: 'Electronic',
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      const category = Category.create(data);

      expect(category).toBeDefined();
      expect(category).toMatchObject(data);
      expect(category.id).toBeDefined();
      expect(category.createdAt).toBeDefined();
    });
  });
});
