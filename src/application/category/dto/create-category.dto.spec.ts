import { describe, it } from '@jest/globals';
import { CreateCategoryDTO } from './create-category.dto';

describe('CreateCategoryDTO', () => {
  it('should create an instance and assign properties correctly', () => {
    const categoryData = {
      name: 'electronics',
      displayName: 'Electronics',
    };

    const dto = new CreateCategoryDTO();
    dto.name = categoryData.name;
    dto.displayName = categoryData.displayName;

    expect(dto.name).toBe(categoryData.name);
    expect(dto.displayName).toBe(categoryData.displayName);
    expect(dto).toEqual(categoryData);
  });
});
