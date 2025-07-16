import { BaseEntity } from '@shared/entities/base.entity';

export class Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
}
