import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from '../urls.controller';
import { UrlsService } from '../urls.service';
import { shortenURL } from '../../utils';
import { v4 as uuidv4 } from 'uuid';
import { mockUrls } from './data/urls';

describe('UrlsController', () => {
  let controller: UrlsController;

  const mockUrlService = {
    create: jest.fn(async (urlDto) => {
      const id = uuidv4();
      const counter = Date.now();
      const { shortenedURL } = shortenURL(urlDto.original, counter);
      const urlDtoWithShortedVersion = {
        id,
        shortened: shortenedURL,
        counter,
        visits: 0,
        ...urlDto,
      };
      mockUrls.push(urlDtoWithShortedVersion);
      return mockUrls.find((url) => url.id === id);
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
      return { visits: url.visits++, ...url };
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
      return mockUrls.find((url) => url.id === id);
    }),
    remove: jest.fn((id) => mockUrls.filter((item) => item.id !== id)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [UrlsService],
    })
      .overrideProvider(UrlsService)
      .useValue(mockUrlService)
      .compile();

    controller = module.get<UrlsController>(UrlsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an url', async () => {
    const urlDto = { original: 'http://testing.com' };
    const mockResult = {
      id: expect.any(String),
      counter: expect.any(Number),
      shortened: expect.any(String),
      original: urlDto.original,
      visits: 0,
    };
    const url = await controller.create(urlDto);
    expect(mockResult).toEqual(url);
  });

  it('should update an url', async () => {
    const urlToUpdate = mockUrls[0];
    const urlDto = { original: 'http://newOne.com' };
    const updatedUrl = await controller.update(urlToUpdate.id, urlDto);
    expect(updatedUrl.original).toBe(urlToUpdate.original);
  });

  it('should get top 100 urls order by visits', async () => {
    const visitedUrl = await controller.findOne(mockUrls[0].id);
    const urls = await controller.findAll();
    expect(urls).toEqual(mockUrls);
    expect(urls[0].visits).toBe(visitedUrl.visits);
  });

  it('should get by term', async () => {
    const urlById = await controller.findOne(mockUrls[0].id);
    const urlByCounter = await controller.findOne(mockUrls[0].counter);
    const urlByOriginal = await controller.findOne(mockUrls[0].original);
    const urlByShortened = await controller.findOne(mockUrls[0].shortened);

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
    const urls = await controller.remove(urlToDelete.id);
    expect(urls).not.toContain(urlToDelete);
  });
});
