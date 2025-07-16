import { describe, it, expect } from '@jest/globals';
import { VoInvalidValue } from './vo-invalid-value.exception';

describe('VoInvalidValue', () => {
  it('should create a new error with correct message', () => {
    const name = 'VoTest';

    const voException = new VoInvalidValue(name);

    expect(voException.name).toBe('VoInvalidValue');
    expect(voException.message).toBe('Invalid value for VoTest');
  });

  it('should be an instance of the native Error class', () => {
    const voException = new VoInvalidValue('VoTest');

    expect(voException).toBeInstanceOf(Error);
  });

  it('should return value object exception instance', () => {
    try {
      const name = 'VoTest';
      throw new VoInvalidValue(name);
    } catch (error) {
      expect(error).toBeInstanceOf(VoInvalidValue);
    }
  });
});
