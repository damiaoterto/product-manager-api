import { CreateProduct } from './create-product.dto';

describe('CreateProductDTO', () => {
  it('should create an instance and assign all properties correctly', () => {
    const productData = {
      name: 'Laptop Pro X',
      description: 'A high-performance laptop for professionals.',
      price: 1499.99,
      categories: ['electronics', 'computers'],
    };

    const dto = new CreateProduct();
    dto.name = productData.name;
    dto.description = productData.description;
    dto.price = productData.price;
    dto.categories = productData.categories;

    expect(dto.name).toBe(productData.name);
    expect(dto.description).toBe(productData.description);
    expect(dto.price).toBe(productData.price);
    expect(dto.categories).toEqual(productData.categories);

    expect(dto).toEqual(productData);
  });
});
