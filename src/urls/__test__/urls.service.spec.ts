import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from '../urls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Url } from '../entities/url.entity';
import { shortenURL } from '../../utils';
import { mockUrls } from './data/urls';

describe('UrlsService', () => {
  let service: UrlsService;

  const mockUrlsRepository = {
    create: jest.fn((urlDto) => {
      const counter = Date.now();
      const { shortenedURL } = shortenURL(urlDto.original, counter);
      const newUrl = {
        id: uuidv4(),
        counter,
        shortened: shortenedURL,
        visits: 0,
        ...urlDto,
      };
      mockUrls.push(newUrl);
      return Promise.resolve(mockUrls.find((url) => url.id === newUrl.id));
    }),
    findAll: jest.fn(() => mockUrls.sort((a, b) => b.visits - a.visits)),
    findOne: jest.fn((term) => {
      const url = mockUrls.find(
        (url) =>
          url.id === term ||
          url.counter === term ||
          url.original === term ||
          url.shortened === term,
      );
      return Promise.resolve({ visits: url.visits++, ...url });
    }),
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
      return Promise.resolve(mockUrls.find((url) => url.id === id));
    }),
    remove: jest.fn((id) =>
      Promise.resolve(mockUrls.filter((item) => item.id !== id)),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlsRepository,
        },
      ],
    })
      .overrideProvider(UrlsService)
      .useValue(mockUrlsRepository)
      .compile();

    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new url', async () => {
    const urlDto = { original: 'http://testing.com' };
    const mockResult = {
      id: expect.any(String),
      counter: expect.any(Number),
      shortened: expect.any(String),
      original: urlDto.original,
      visits: 0,
    };
    const response = await service.create(urlDto);
    expect(response).toEqual(mockResult);
  });

  it('should update an url', async () => {
    const urlToUpdate = mockUrls[0];
    const urlDto = { original: 'http://newOne.com' };
    const updatedUrl = await service.updateUrl(urlToUpdate.id, urlDto);
    expect(updatedUrl.original).toBe(urlToUpdate.original);
  });

  it('should get top 100 urls order by visits', async () => {
    const visitedUrl = await service.findOne(mockUrls[0].id);
    const urls = await service.findAll({});
    expect(urls).toEqual(mockUrls);
    expect(urls[0].visits).toBe(visitedUrl.visits);
  });

  it('should get by term', async () => {
    const urlById = await service.findOne(mockUrls[0].id);
    const urlByCounter = await service.findOne(mockUrls[0].counter);
    const urlByOriginal = await service.findOne(mockUrls[0].original);
    const urlByShortened = await service.findOne(mockUrls[0].shortened);

    expect(urlById).toEqual({ visits: urlById.visits++, ...urlByCounter });
    expect(urlByCounter).toEqual({
      visits: urlByCounter.visits++,
      ...urlByOriginal,
    });
    expect(urlByOriginal).toEqual({
      visits: urlByOriginal.visits++,
      ...urlByShortened,
    });
  });

  it('should delete an url', async () => {
    const urlToDelete = mockUrls[0];
    const urls = await service.remove(urlToDelete.id);
    expect(urls).not.toContain(urlToDelete);
  });
});
