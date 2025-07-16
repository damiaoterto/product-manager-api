import { describe, beforeEach, it, expect } from '@jest/globals';
import { Product } from './product.entity';
import { randomUUID } from 'crypto';

describe('Product Entity', () => {
  let product: Product;

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
  });
});
