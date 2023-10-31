import { Module } from '@nestjs/common';
import { ScrapeService } from './features/scrape/scrape.service';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ScrapeProducer } from './features/scrape/gateways/queue/scrapes/scrape.producer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeDatabaseEntity } from './features/scrape/gateways/database/entities/scrape.entity';
import { ScrapeQueriesDAO } from './features/scrape/gateways/database/scrape-queries.dao';
import { ScrapeController } from './features/scrape/entrypoints/rest/scrape.controller';
import { ScrapeDataDatabaseEntity } from './features/scrape/gateways/database/entities/scrape-data.entity';
import { ScrapeOperationsDAO } from './features/scrape/gateways/database/scrape-operations.dao';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.QUEUE_REDIS_HOST,
        port: +process.env.QUEUE_REDIS_PORT,
        db: +process.env.QUEUE_REDIS_DB,
      },
    }),
    BullModule.registerQueue({
      name: process.env.QUEUE_NAME,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: process.env.QUEUE_NAME,
      adapter: BullMQAdapter,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      // leaving these below to simplify
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ScrapeDatabaseEntity, ScrapeDataDatabaseEntity]),
  ],
  controllers: [ScrapeController],
  providers: [
    ScrapeService,
    ScrapeProducer,
    ScrapeQueriesDAO,
    ScrapeOperationsDAO,
  ],
})
export class AppModule {}
