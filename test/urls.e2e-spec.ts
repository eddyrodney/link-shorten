import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UrlsModule } from '../src/urls/urls.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from '../src/urls/entities/url.entity';
import { mockUrls } from '../src/urls/__test__/data/urls';
import { addHostToShortenedUrl, shortenURL } from '../src/utils';
import { v4 as uuidv4 } from 'uuid';

describe('UrlsController (e2e)', () => {
  let app: INestApplication;
  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue(mockUrls),
    findOneBy: jest
      .fn()
      .mockResolvedValue((id) => mockUrls.find((url) => url.id === id)),
    save: jest.fn(),
    create: jest.fn(async (urlDto) => {
      const counter = Date.now();
      const { shortenedURL } = shortenURL(urlDto.original, counter);
      const newUrl = {
        id: uuidv4(),
        counter,
        shortened: shortenedURL,
        visits: 0,
        ...urlDto,
      };
      mockUrls.push(addHostToShortenedUrl(newUrl));
      return Promise.resolve(mockUrls.find((url) => url.id === newUrl.id));
    }),
    preload: jest.fn().mockResolvedValue((url) => url),
    update: jest.fn().mockResolvedValue((url) => url),
    updateUrl: jest.fn(async (id, urlDto) => {
      const counter = Date.now();
      const { shortenedURL } = shortenURL(urlDto.original, counter);
      const urlDtoWithShortedVersion = {
        id,
        shortened: shortenedURL,
        counter,
        visits: 0,
        ...urlDto,
      };
      mockUrls.forEach((url) => {
        if (url.id === id) {
          url = urlDtoWithShortedVersion;
        }
      });
      const url = mockUrls.find((url) => url.id === id)
      return Promise.resolve(addHostToShortenedUrl(url));
    }),
    remove: jest.fn((id) =>
      Promise.resolve(mockUrls.filter((item) => item.id !== id)),
    ),
    delete: jest
      .fn()
      .mockResolvedValue((id) => mockUrls.filter((url) => url.id !== id)),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UrlsModule],
    })
      .overrideProvider(getRepositoryToken(Url))
      .useValue(mockUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('/urls (POST)', async () => {
    const urlDto = { original: 'http://testing.com' };
    return request(app.getHttpServer())
      .post('/urls')
      .send(urlDto)
      .expect('Content-Type', /json/)
      .expect(201);
  });

  it('/urls (GET)', () => {
    const mockUrlsShortWithHost = [];
    mockUrls.forEach((url) =>
      mockUrlsShortWithHost.push(addHostToShortenedUrl(url)),
    );
    return request(app.getHttpServer())
      .get('/urls')
      .expect(200)
      .expect(mockUrlsShortWithHost);
  });

  it('/urls/:term (GET)', () => {
    const { id } = mockUrls[0];
    const req = `/urls/${id}`;
    return request(app.getHttpServer()).get(req).expect(200);
  });

  it('/urls/:term (PATCH)', async () => {
    const urlDto = { original: 'http://newOne.com' };
    const { id } = mockUrls[0];
    const req = `/urls/${id}`;

    return request(app.getHttpServer())
      .patch(req)
      .set('Accept', 'application/json')
      .send(urlDto)
      .expect(200);
  });

  it('/urls (DELETE)', async () => {
    const { id } = mockUrls[0];
    const req = `/urls/${id}`;

    return request(app.getHttpServer())
      .delete(req)
      .set('Accept', 'application/json')
      .expect(200);
  });
});
