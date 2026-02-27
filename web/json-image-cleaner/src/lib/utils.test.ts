import { describe, it, expect } from 'vitest';
import { findAllStrings, isLikelyImageUrl } from './utils';

describe('findAllStrings', () => {
  it('should find strings in a simple object', () => {
    const obj = { name: 'test', value: 123 };
    const result = findAllStrings(obj);
    expect(result).toEqual([
      { value: 'test', path: 'name' }
    ]);
  });

  it('should find strings in nested objects', () => {
    const obj = { 
      user: { 
        name: 'John', 
        email: 'john@example.com' 
      } 
    };
    const result = findAllStrings(obj);
    expect(result).toEqual([
      { value: 'John', path: 'user.name' },
      { value: 'john@example.com', path: 'user.email' }
    ]);
  });

  it('should find strings in arrays', () => {
    const obj = { items: ['a', 'b', 'c'] };
    const result = findAllStrings(obj);
    expect(result).toEqual([
      { value: 'a', path: 'items[0]' },
      { value: 'b', path: 'items[1]' },
      { value: 'c', path: 'items[2]' }
    ]);
  });

  it('should handle empty objects', () => {
    expect(findAllStrings({})).toEqual([]);
    expect(findAllStrings(null)).toEqual([]);
    expect(findAllStrings(undefined)).toEqual([]);
  });

  it('should handle complex nested structures', () => {
    const obj = {
      users: [
        { name: 'Alice', profile: { avatar: 'https://example.com/alice.png' } },
        { name: 'Bob', profile: { avatar: 'https://example.com/bob.jpg' } }
      ]
    };
    const result = findAllStrings(obj);
    expect(result).toEqual([
      { value: 'Alice', path: 'users[0].name' },
      { value: 'https://example.com/alice.png', path: 'users[0].profile.avatar' },
      { value: 'Bob', path: 'users[1].name' },
      { value: 'https://example.com/bob.jpg', path: 'users[1].profile.avatar' }
    ]);
  });
});

describe('isLikelyImageUrl', () => {
  it('should return true for URLs with image extensions', () => {
    expect(isLikelyImageUrl('https://example.com/image.jpg')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/image.jpeg')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/image.png')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/image.gif')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/image.webp')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/image.avif')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/image.bmp')).toBe(true);
  });

  it('should return true for URLs with query strings', () => {
    expect(isLikelyImageUrl('https://example.com/image.jpg?size=100')).toBe(true);
  });

  it('should return true for short HTTP URLs without extension', () => {
    expect(isLikelyImageUrl('https://example.com/img')).toBe(true);
    expect(isLikelyImageUrl('https://x.com/y')).toBe(true);
  });

  it('should return false for long URLs without image extension', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(200);
    expect(isLikelyImageUrl(longUrl)).toBe(false);
  });

  it('should return false for non-HTTP URLs', () => {
    expect(isLikelyImageUrl('ftp://example.com/image.jpg')).toBe(false);
    expect(isLikelyImageUrl('file:///images/photo.png')).toBe(false);
  });

  it('should be case insensitive', () => {
    expect(isLikelyImageUrl('HTTPS://EXAMPLE.COM/IMAGE.JPG')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/IMAGE.PNG')).toBe(true);
  });
});
