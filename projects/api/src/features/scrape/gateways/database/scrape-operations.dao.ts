import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ScrapeDataDatabaseEntity } from './entities/scrape-data.entity';
import { ScrapeDatabaseEntity } from './entities/scrape.entity';

export type ScrapeSummary = ScrapeDataDatabaseEntity & { dataCount: number };

@Injectable()
export class ScrapeOperationsDAO {
  constructor(private entityManager: EntityManager) {}

  async registerScrapeDataResult(params: {
    scrape: ScrapeDatabaseEntity;
    scrapeData: ScrapeDataDatabaseEntity[];
  }): Promise<ScrapeDataDatabaseEntity> {
    const { scrape, scrapeData } = params;

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.insert(ScrapeDatabaseEntity, [scrape]);

      await transactionalEntityManager.insert(ScrapeDataDatabaseEntity, [
        ...scrapeData,
      ]);
    });

    return;
  }
}
