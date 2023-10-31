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
import { ScrapeResultConsumer } from './features/scrape/entrypoints/queue/scrape-result/scrape-result.consumer';
import { UserController } from './features/user/entrypoints/rest/user.controller';
import { UserService } from './features/user/user.service';
import { UserQueriesDAO } from './features/user/gateways/database/user-queries.dao';
import { UserOperationsDAO } from './features/user/gateways/database/user-operations.dao';
import { HashClient } from './features/user/gateways/client/hash/hash-client.service';
import { TokenClient } from './features/user/gateways/client/token/token-client.service';
import { UserDatabaseEntity } from './features/user/gateways/database/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([
      ScrapeDatabaseEntity,
      ScrapeDataDatabaseEntity,
      UserDatabaseEntity,
    ]),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [ScrapeController, UserController],
  providers: [
    ScrapeService,
    ScrapeProducer,
    ScrapeResultConsumer,
    ScrapeQueriesDAO,
    ScrapeOperationsDAO,
    UserService,
    UserQueriesDAO,
    UserOperationsDAO,
    TokenClient,
    HashClient,
  ],
})
export class AppModule {}
