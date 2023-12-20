const ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

const encode = (counter: number) => {
  if (counter === 0) return ALPHABET[0];

  let shortedUrl = '';
  const base = ALPHABET.length;

  while (counter > 0) {
    shortedUrl += ALPHABET[counter % base];
    counter = Math.floor(counter / base);
  }

  return shortedUrl.split('').reverse().join('');
};

const decode = (shortedUrl: string) => {
  let counter = 0;
  const base = ALPHABET.length;

  for (const char of shortedUrl) {
    counter = counter * base + ALPHABET.indexOf(char);
  }

  return counter;
};

export const shortenURL = (originalURL: string, counter: number) => {
  const encoded = encode(counter);
  const decodedCounter = decode(encoded);
  return { originalURL, decodedCounter, shortenedURL: encoded };
};
