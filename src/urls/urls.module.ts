import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UrlsController],
  providers: [UrlsService],
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Url])],
  exports: [UrlsService]
})
export class UrlsModule {}
