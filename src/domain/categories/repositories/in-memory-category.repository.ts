import { BaseRepository } from '@shared/repositories/base-repository.repository';
import { Category } from '../entities/category.entity';

export class InMemoryCategoryRepository implements BaseRepository<Category> {
  private categories: Category[] = [];

  async findAll(): Promise<Category[]> {
    return this.categories;
  }

  async findOneById(id: string): Promise<Category | undefined> {
    return this.categories.find((category) => category.id === id);
  }

  async createNew(data: Category): Promise<void> {
    this.categories.push(data);
  }

  async update(id: string, data: Partial<Category>): Promise<void> {
    const existsCategory = await this.findOneById(id);

    if (!existsCategory) {
      throw new Error('Category not found');
    }

    const updatedCategory = Category.create({
      ...existsCategory,
      ...data,
    });

    const categoryFilter = this.categories.filter(
      (category) => category.id !== id,
    );

    this.categories = [...categoryFilter, updatedCategory];
  }

  async delete(id: string): Promise<void> {
    const existsCategory = await this.findOneById(id);

    if (!existsCategory) {
      throw new Error('Category not found');
    }

    this.categories = this.categories.filter((category) => category.id !== id);
  }
}
