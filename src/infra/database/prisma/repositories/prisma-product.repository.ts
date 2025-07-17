import { Injectable } from '@nestjs/common';
import { Product } from '@domain/products/entities/product.entity';
import { ProductRepository } from '@domain/products/repositories/product.repository';
import { PrismaClient } from '@generated/prisma';
import { Category } from '@domain/categories/entities/category.entity';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findAll(): Promise<Product[]> {
    const categories = await this.prismaClient.product.findMany({
      include: {
        categories: true,
      },
    });
    return categories.map((product) =>
      Product.create({
        ...product,
        price: product.price.toNumber(),
        categories: product.categories.map((category) =>
          Category.create(category),
        ),
      }),
    );
  }

  async findOneById(id: string): Promise<Product | undefined> {
    const product = await this.prismaClient.product.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!product) return undefined;

    return Product.create({
      ...product,
      price: product.price.toNumber(),
      categories: product.categories.map((category) =>
        Category.create(category),
      ),
    });
  }

  async createNew(data: Product): Promise<void> {
    await this.prismaClient.product.create({
      data: {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        categories: {
          connect: [
            ...data.categories.map((category) => ({ id: category.id! })),
          ],
        },
      },
    });
  }

  async update(
    id: string,
    data: Omit<Partial<Product>, 'categories' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    const existsProduct = await this.findOneById(id);

    if (!existsProduct) {
      throw new Error('Product not found');
    }

    await this.prismaClient.product.update({
      where: { id: existsProduct.id },
      data: { ...data },
    });
  }

  async delete(id: string): Promise<void> {
    const existsProduct = await this.findOneById(id);

    if (!existsProduct) {
      throw new Error('Product not found');
    }

    await this.prismaClient.product.delete({
      where: { id: existsProduct.id },
    });
  }
}
