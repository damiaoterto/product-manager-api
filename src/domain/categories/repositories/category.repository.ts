import { BaseRepository } from '@shared/repositories/base-repository.repository';
import { Category } from '../entities/category.entity';

export abstract class CategoryRepository extends BaseRepository<Category> {}
