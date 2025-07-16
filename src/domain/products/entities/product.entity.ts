import { BaseEntity } from '@shared/entities/base.entity';
import { randomUUID } from 'node:crypto';
import { PriceValueObject } from '../value-objects/price.vo';

export class Product extends BaseEntity {
  name: string;
  description: string;
  price: number;

  static create(data: Product): Product {
    const product = new Product();

    product.id = data.id ?? randomUUID().toString();
    product.name = data.name;
    product.description = data.description;
    product.price = new PriceValueObject(data.price).value;
    product.createdAt = data.createdAt ?? new Date();
    product.updatedAt = data.updatedAt ?? null;
    product.deletedAt = data.deletedAt ?? null;

    return product;
  }
}
