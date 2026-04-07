import { enumSchema, pagingSchema, getTakeSkip, type pagingDTO } from './utils';
import { UserRoles } from '../../user/user.enum';

describe('Utils', () => {
  describe('enumSchema', () => {
    it('should create enum schema that transforms string keys to numeric values', () => {
      const schema = enumSchema(UserRoles);

      expect(schema.parse('ADMIN')).toBe(0);
      expect(schema.parse('USER')).toBe(1);
    });

    it('should throw error for invalid enum value', () => {
      const schema = enumSchema(UserRoles);

      expect(() => schema.parse('INVALID')).toThrow();
    });
  });

  describe('pagingSchema', () => {
    it('should parse valid paging parameters', () => {
      const result = pagingSchema.parse({
        page: '2',
        size: '20',
        paging: 'true',
      });

      expect(result).toEqual({
        page: 2,
        size: 20,
        paging: true,
      });
    });

    it('should handle string boolean values', () => {
      expect(pagingSchema.parse({ paging: 'true' })).toEqual({ paging: true });
      expect(pagingSchema.parse({ paging: 'false' })).toEqual({ paging: false });
      expect(pagingSchema.parse({ paging: '1' })).toEqual({ paging: true });
      expect(pagingSchema.parse({ paging: '0' })).toEqual({ paging: false });
      expect(pagingSchema.parse({ paging: 'yes' })).toEqual({ paging: true });
      expect(pagingSchema.parse({ paging: 'no' })).toEqual({ paging: false });
    });

    it('should make parameters optional', () => {
      const result = pagingSchema.parse({});

      expect(result.page).toBeUndefined();
      expect(result.size).toBeUndefined();
      expect(result.paging).toBeUndefined();
    });
  });

  describe('getTakeSkip', () => {
    it('should return take and skip for valid paging parameters', () => {
      const paging: pagingDTO = { page: 2, size: 20, paging: true };

      const result = getTakeSkip(paging);

      expect(result).toEqual({
        take: 20,
        skip: 20, // (page - 1) * size = (2 - 1) * 20 = 20
      });
    });

    it('should use default values when page and size are not provided', () => {
      const paging: pagingDTO = { paging: true };

      const result = getTakeSkip(paging);

      expect(result).toEqual({
        take: 10, // default size
        skip: 0,  // (1 - 1) * 10 = 0
      });
    });

    it('should return undefined when paging is false', () => {
      const paging: pagingDTO = { paging: false };

      const result = getTakeSkip(paging);

      expect(result).toBeUndefined();
    });

    it('should return undefined when paging is not provided and defaults to true but no page/size', () => {
      const paging: pagingDTO = {};

      const result = getTakeSkip(paging);

      expect(result).toBeUndefined();
    });

    it('should handle page 1 correctly', () => {
      const paging: pagingDTO = { page: 1, size: 10, paging: true };

      const result = getTakeSkip(paging);

      expect(result).toEqual({
        take: 10,
        skip: 0, // (1 - 1) * 10 = 0
      });
    });

    it('should handle large page numbers', () => {
      const paging: pagingDTO = { page: 5, size: 25, paging: true };

      const result = getTakeSkip(paging);

      expect(result).toEqual({
        take: 25,
        skip: 100, // (5 - 1) * 25 = 100
      });
    });
  });
});