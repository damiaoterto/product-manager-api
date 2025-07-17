import { UpdateProductDTO } from './update-product.dto';

describe('UpdateProductDTO', () => {
  it('should create an instance and assign all properties correctly', () => {
    const dtoData = {
      name: 'Updated Laptop',
      description: 'An updated high-performance laptop.',
      price: 1599.99,
      categories: ['electronics', 'computers', 'new-arrivals'],
    };

    const dto = new UpdateProductDTO();
    dto.name = dtoData.name;
    dto.description = dtoData.description;
    dto.price = dtoData.price;
    dto.categories = dtoData.categories;

    expect(dto).toEqual(dtoData);
  });

  it('should handle partial data correctly', () => {
    const dtoData = {
      name: 'Just a new name',
    };

    const dto = new UpdateProductDTO();
    dto.name = dtoData.name;

    expect(dto.name).toBe(dtoData.name);
    expect(dto.description).toBeUndefined();
    expect(dto.price).toBeUndefined();
    expect(dto.categories).toBeUndefined();
  });

  it('should create an empty instance when no data is provided', () => {
    const dto = new UpdateProductDTO();

    expect(dto.name).toBeUndefined();
    expect(dto.description).toBeUndefined();
    expect(dto.price).toBeUndefined();
    expect(dto.categories).toBeUndefined();
  });
});
