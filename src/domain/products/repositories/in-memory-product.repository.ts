import { Product } from '../entities/product.entity';
import { ProductRepository } from './product.repository';

export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = [];

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findOneById(id: string): Promise<Product | undefined> {
    return this.products.find((product) => product.id === id);
  }

  async createNew(data: Product): Promise<void> {
    this.products.push(data);
  }

  async update(id: string, product: Partial<Product>): Promise<void> {
    const existsProduct = await this.findOneById(id);

    if (!existsProduct) {
      throw new Error('Product not found');
    }

    const updatedProduct = Product.create({
      ...existsProduct,
      ...product,
    });

    const productsFilter = this.products.filter((product) => product.id !== id);
    this.products = [...productsFilter, updatedProduct];
  }

  async delete(id: string): Promise<void> {
    const existsProduct = await this.findOneById(id);

    if (!existsProduct) {
      throw new Error('Product not found');
    }

    this.products = this.products.filter((product) => product.id !== id);
  }
}
