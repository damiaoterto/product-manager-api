import { describe } from '@jest/globals';
import { PriceValueObject } from './price.vo';
import { VoInvalidValue } from '@shared/exception/vo-invalid-value.exception';

describe('Price Value Object', () => {
  const validValue = 12312;
  const invalidValue = 'abc';

  it('should create a price value object instance', () => {
    const vo = new PriceValueObject(validValue);

    expect(vo).toBeInstanceOf(PriceValueObject);
    expect(vo.value).toBe(validValue);
  });

  it('should return a exception if invalid value', () => {
    try {
      new PriceValueObject(Number.parseInt(invalidValue));
    } catch (error) {
      expect(error).toBeInstanceOf(VoInvalidValue);
    }
  });
});
