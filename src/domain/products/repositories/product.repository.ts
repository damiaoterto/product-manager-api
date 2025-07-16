import { BaseRepository } from '@shared/repositories/base-repository.repository';
import { Product } from '../entities/product.entity';

export abstract class ProductRepository extends BaseRepository<Product> {}
