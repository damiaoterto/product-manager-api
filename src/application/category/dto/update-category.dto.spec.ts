import { UpdateCategoryDTO } from './update-category.dto';

describe('UpdateCategoryDTO', () => {
  it('should create an instance and assign all properties correctly', () => {
    const dtoData = {
      name: 'updated-electronics',
      displayName: 'Updated Electronics',
    };

    const dto = new UpdateCategoryDTO();
    dto.name = dtoData.name;
    dto.displayName = dtoData.displayName;

    expect(dto.name).toBe(dtoData.name);
    expect(dto.displayName).toBe(dtoData.displayName);
    expect(dto).toEqual(dtoData);
  });

  it('should handle partial data correctly (only name)', () => {
    const dto = new UpdateCategoryDTO();
    dto.name = 'new-name';

    expect(dto.name).toBe('new-name');
    expect(dto.displayName).toBeUndefined();
  });

  it('should handle partial data correctly (only displayName)', () => {
    const dto = new UpdateCategoryDTO();
    dto.displayName = 'New Display Name';

    expect(dto.name).toBeUndefined();
    expect(dto.displayName).toBe('New Display Name');
  });

  it('should create an empty instance when no data is provided', () => {
    const dto = new UpdateCategoryDTO();

    expect(dto.name).toBeUndefined();
    expect(dto.displayName).toBeUndefined();
  });
});
