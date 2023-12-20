import { shortenURL } from '../shortenUrl';

describe('shortenURL', () => {
  it('should encode and decode correctly with a non-zero counter', () => {
    const originalURL = 'http://testing.com';
    const counter = 123;

    const result = shortenURL(originalURL, counter);

    expect(result.originalURL).toBe(originalURL);
    expect(result.decodedCounter).toBe(counter);
    expect(result.shortenedURL).toEqual(expect.any(String));
  });

  it('should encode and decode correctly with a counter of 0', () => {
    const originalURL = 'http://testing.com';
    const counter = 0;

    const result = shortenURL(originalURL, counter);

    expect(result.originalURL).toBe(originalURL);
    expect(result.decodedCounter).toBe(counter);
    expect(result.shortenedURL).toEqual(expect.any(String));
  });
});
