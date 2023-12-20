import { isIP } from 'class-validator';
import { Url } from 'src/urls/entities/url.entity';

export const addHostToShortenedUrl = (urlDto: Url) => {
  let host = '';
  if (process.env.HOST === 'localhost' || isIP(process.env.HOST)) {
    host = `${process.env.HOST}:${process.env.PORT}`;
  }
  const shortened = `http://${host}/${urlDto.shortened}`;
  return {
    ...urlDto,
    shortened,
  };
};
