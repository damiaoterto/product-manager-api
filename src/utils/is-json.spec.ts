/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isJson } from './is-json';

describe('isJson', () => {
  describe('when value is a valid JSON', () => {
    it('should return true for a valid JSON object string', () => {
      expect(isJson('{"key":"value"}')).toBe(true);
    });

    it('should return true for an empty JSON object string', () => {
      expect(isJson('{}')).toBe(true);
    });

    it('should return true for a valid JSON array string', () => {
      expect(isJson('[1, "test", null, {}]')).toBe(true);
    });

    it('should return true for an empty JSON array string', () => {
      expect(isJson('[]')).toBe(true);
    });
  });

  describe('when value is not a valid JSON', () => {
    it('should return false for a malformed JSON string', () => {
      expect(isJson('{"key": "value"')).toBe(false); // Faltando }
    });

    it('should return false for a string with single quotes (invalid JSON)', () => {
      expect(isJson("{'key':'value'}")).toBe(false);
    });

    it('should return false for a simple string', () => {
      expect(isJson('just a string')).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(isJson('')).toBe(false);
    });

    it('should return false for a JSON string representing a primitive number', () => {
      expect(isJson('123')).toBe(false);
    });

    it('should return false for a JSON string representing a primitive string', () => {
      expect(isJson('"a string"')).toBe(false);
    });

    it('should return false for a JSON string representing null', () => {
      expect(isJson('null')).toBe(false);
    });

    it('should return false for undefined', () => {
      // @ts-ignore
      expect(isJson(undefined)).toBe(false);
    });

    it('should return false for null', () => {
      // @ts-ignore
      expect(isJson(null)).toBe(false);
    });
  });
});
