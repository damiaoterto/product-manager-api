import { Injectable } from '@nestjs/common';
import { Product } from '@domain/products/entities/product.entity';
import { ProductRepository } from '@domain/products/repositories/product.repository';
import { PrismaClient } from '@generated/prisma';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findAll(): Promise<Product[]> {
    const categories = await this.prismaClient.product.findMany();
    return categories.map((product) =>
      Product.create({
        ...product,
        price: product.price.toNumber(),
      }),
    );
  }

  async findOneById(id: string): Promise<Product | undefined> {
    const product = await this.prismaClient.product.findUnique({
      where: { id },
    });

    if (!product) return undefined;

    return Product.create({
      ...product,
      price: product.price.toNumber(),
    });
  }

  async createNew(data: Product): Promise<void> {
    await this.prismaClient.product.create({
      data: {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
      },
    });
  }

  async update(
    id: string,
    data: Omit<Partial<Product>, 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    const existsCategory = await this.findOneById(id);

    if (!existsCategory) {
      throw new Error('Product not found');
    }

    await this.prismaClient.category.update({
      where: { id: existsCategory.id },
      data: { ...data },
    });
  }

  async delete(id: string): Promise<void> {
    const existsProduct = await this.findOneById(id);

    if (!existsProduct) {
      throw new Error('Product not found');
    }

    await this.prismaClient.category.delete({
      where: { id: existsProduct.id },
    });
  }
}
