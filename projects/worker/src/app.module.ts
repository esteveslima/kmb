import { Module } from '@nestjs/common';
import { ScrapeConsumer } from './features/scrape/entrypoints/queue/scrapes/scrape.consumer';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HttpModule } from '@nestjs/axios';
import { ScrapeService } from './features/scrape/scrape.service';
import { WebpageFetcherService } from './features/scrape/gateways/http/webpage-fetcher.service';
import { ScrapeResultProducer } from './features/scrape/gateways/queue/scrapes/scrape-result.producer';

@Module({
  imports: [
    HttpModule,

    BullModule.forRoot({
      redis: {
        host: process.env.QUEUE_REDIS_HOST,
        port: +process.env.QUEUE_REDIS_PORT,
        db: +process.env.QUEUE_REDIS_DB,
      },
    }),
    BullModule.registerQueue(
      { name: process.env.QUEUE_SCRAPE_NAME },
      { name: process.env.QUEUE_SCRAPE_RESULT_NAME },
    ),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature(
      {
        name: process.env.QUEUE_SCRAPE_NAME,
        adapter: BullMQAdapter,
      },
      {
        name: process.env.QUEUE_SCRAPE_RESULT_NAME,
        adapter: BullMQAdapter,
      },
    ),
  ],
  providers: [
    ScrapeConsumer,
    ScrapeResultProducer,
    ScrapeService,
    WebpageFetcherService,
  ],
})
export class AppModule {}
