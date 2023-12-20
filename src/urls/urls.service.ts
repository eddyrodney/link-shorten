import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import {
  shortenURL,
  handleDbExceptions,
  addHostToShortenedUrl,
} from '../utils';
import { PaginationDto } from '../common/pagination/pagination.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}
  async create(createUrlDto: CreateUrlDto) {
    const counter = Date.now();
    const { shortenedURL } = shortenURL(createUrlDto.original, counter);
    const urlDtoWithShortedVersion = {
      shortened: shortenedURL,
      counter,
      ...createUrlDto,
    };
    const url = this.urlRepository.create(urlDtoWithShortedVersion);

    try {
      await this.urlRepository.save(url);
      return addHostToShortenedUrl(url);
    } catch (error) {
      handleDbExceptions('url', error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 100, offset = 0 } = paginationDto;
    const urls = await this.urlRepository.find({
      take: limit,
      skip: offset,
      order: {
        visits: 'DESC',
      },
    });
    const urlsWithHost = [];
    urls.forEach((url) => {
      urlsWithHost.push(addHostToShortenedUrl(url));
    });
    return urlsWithHost;
  }

  async findOne(term: string | number) {
    let url: Url;

    if (isUUID(term)) {
      url = await this.urlRepository.findOneBy({ id: term as string });
    } else {
      const queryBuilder = this.urlRepository.createQueryBuilder();
      url = await queryBuilder
        .where(
          `original = :original OR shortened =:shortened OR counter = :counter`,
          {
            original: term,
            shortened: term,
            counter: term,
          },
        )
        .getOne();
    }
    if (!url) {
      throw new BadRequestException(`url with ID ${term} not found`);
    }
    this.urlRepository.update(url.id, { visits: url.visits++, ...url });
    return addHostToShortenedUrl(url);
  }

  async updateUrl(id: string, updateUrlDto: UpdateUrlDto) {
    const counter = Date.now();
    const { shortenedURL } = shortenURL(updateUrlDto.original, counter);
    const url = await this.urlRepository.preload({
      id,
      shortened: shortenedURL,
      counter,
      ...updateUrlDto,
    });

    if (!url) throw new NotFoundException(`url with id: ${id} was not found`);

    try {
      await this.urlRepository.save(url);
      return addHostToShortenedUrl(url);
    } catch (error) {
      handleDbExceptions('url', error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`url with id: ${id} was not found`);
    }
    await this.urlRepository.delete({ id });
    return `url with id ${id} was deleted.`;
  }

  async deleteAllUrls() {
    const query = this.urlRepository.createQueryBuilder('urls');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      handleDbExceptions('url',error);
    }
  }
}
