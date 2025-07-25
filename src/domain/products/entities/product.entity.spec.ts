import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { VoInvalidValue } from '@shared/exception/vo-invalid-value.exception';
import { randomUUID } from 'node:crypto';
import { Product } from './product.entity';
import { Category } from '@domain/categories/entities/category.entity';

// Mock da entidade Category, pois é uma dependência
jest.mock('@domain/categories/entities/category.entity');

describe('Product Entity', () => {
  let product: Product;
  // Cria um objeto mock para representar uma categoria nos testes
  const mockCategory = {
    id: randomUUID().toString(),
    name: 'electronics',
    displayName: 'Electronics',
    createdAt: new Date(),
  } as Category;

  beforeEach(() => {
    product = new Product();
  });

  it('should be defined', () => {
    expect(product).toBeDefined();
  });

  describe('Attribute Definition', () => {
    it('should define id attribute', () => {
      const id = randomUUID().toString();
      product.id = id;
      expect(product.id).toBe(id);
    });

    it('should define description attribute', () => {
      const description = 'Apple Pen';
      product.description = description;
      expect(product.description).toBe(description);
    });

    it('should define price attribute', () => {
      const price = 12.4;
      product.price = price;
      expect(product.price).toBe(price);
    });

    it('should define categories attribute', () => {
      const categories = [mockCategory];
      product.categories = categories;
      expect(product.categories).toEqual(categories);
      expect(product.categories).toBeInstanceOf(Array);
    });
  });

  describe('Factory Method', () => {
    it('should create a product entity instance', () => {
      const data = {
        name: 'Apple',
        description: 'Green Apple',
        price: 2.3,
        categories: [mockCategory],
      };

      const product = Product.create(data);

      expect(product).toBeDefined();
      expect(product).toBeInstanceOf(Product);
      expect(product).toMatchObject(data);
      expect(product.id).toBeDefined();
      expect(product.createdAt).toBeDefined();
    });

    it('should create a product entity instance with all attrs', () => {
      const currentDate = new Date();

      const data = {
        id: randomUUID().toString(),
        name: 'Apple',
        description: 'Green Apple',
        price: 2.3,
        categories: [mockCategory],
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      const product = Product.create(data);

      expect(product).toBeDefined();
      expect(product).toBeInstanceOf(Product);
      expect(product).toMatchObject(data);
      expect(product.id).toBeDefined();
      expect(product.createdAt).toBeDefined();
    });

    it('should return a exception if invalid value for price attr', () => {
      const price = Number('abc123');

      const data = {
        name: 'Apple',
        description: 'Green Apple',
        price,
        categories: [mockCategory],
      };

      try {
        Product.create(data);
      } catch (error) {
        expect(error).toBeInstanceOf(VoInvalidValue);
        expect((error as VoInvalidValue).message).toBe(
          'Invalid value for PriceValueObject',
        );
      }
    });
  });
});
