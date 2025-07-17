import { randomUUID } from 'node:crypto';
import { BaseEntity } from '@shared/entities/base.entity';

export class Category extends BaseEntity {
  name: string;
  displayName: string;

  static create(data: Category): Category {
    const category = new Category();

    category.id = data.id ?? randomUUID().toString();
    category.name = data.name;
    category.displayName = data.displayName;
    category.createdAt = data.createdAt ?? new Date();
    category.updatedAt = data.updatedAt ?? null;

    return category;
  }
}
