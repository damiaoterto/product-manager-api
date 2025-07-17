import { Injectable } from '@nestjs/common';
import { Category } from '@domain/categories/entities/category.entity';
import { CategoryRepository } from '@domain/categories/repositories/category.repository';
import { PrismaClient } from '@generated/prisma';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.prismaClient.category.findMany();
    return categories.map((category) => Category.create(category));
  }

  async findOneById(id: string): Promise<Category | undefined> {
    const category = await this.prismaClient.category.findUnique({
      where: { id },
    });

    if (!category) return undefined;

    return Category.create(category);
  }

  async findOneByName(name: string): Promise<Category | undefined> {
    const category = await this.prismaClient.category.findUnique({
      where: { name },
    });

    if (!category) return undefined;

    return Category.create(category);
  }

  async createNew(data: Category): Promise<void> {
    await this.prismaClient.category.create({
      data: {
        id: data.id,
        name: data.name,
        displayName: data.displayName,
        createdAt: data.createdAt!,
      },
    });
  }

  async update(
    id: string,
    data: Omit<Partial<Category>, 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    const existsCategory = await this.findOneById(id);

    if (!existsCategory) {
      throw new Error('Category not found');
    }

    await this.prismaClient.category.update({
      where: { id: existsCategory.id },
      data: { ...data },
    });
  }

  async delete(id: string): Promise<void> {
    const existsCategory = await this.findOneById(id);

    if (!existsCategory) {
      throw new Error('Category not found');
    }

    await this.prismaClient.category.delete({
      where: { id: existsCategory.id },
    });
  }
}
