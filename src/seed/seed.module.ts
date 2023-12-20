import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UrlsModule } from '../urls/urls.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [UrlsModule]
})
export class SeedModule {}
