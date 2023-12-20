import { Injectable } from '@nestjs/common';
import { mockUrls } from '../urls/__test__/data/urls';
import { UrlsService } from 'src/urls/urls.service';
import { addHostToShortenedUrl } from 'src/utils';

@Injectable()
export class SeedService {
  constructor(private readonly urlsService: UrlsService){}
  async runSeed(){
    await this.insertNewProducts();
    return 'Seed executed.';
  }

  private async insertNewProducts() {
    await this.urlsService.deleteAllUrls();
    const urlsPromises = [];
    mockUrls.forEach(url => urlsPromises.push(this.urlsService.create(url)));
    await Promise.all(urlsPromises);
    return true;
  }
}
