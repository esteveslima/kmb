import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ScrapeDataDatabaseEntity } from './entities/scrape-data.entity';
import { ScrapeDatabaseEntity } from './entities/scrape.entity';

@Injectable()
export class ScrapeOperationsDAO {
  constructor(private entityManager: EntityManager) {}

  async registerScrapeInit(params: {
    page: string;
    userId: number;
  }): Promise<Partial<ScrapeDatabaseEntity>> {
    const { page, userId } = params;

    const scrapeInitRecord: Partial<ScrapeDatabaseEntity> = {
      pageName: page,
      status: 'pending',
      user: userId,
    };

    const insertResult = await this.entityManager.insert(ScrapeDatabaseEntity, [
      scrapeInitRecord,
    ]);

    const result: Partial<ScrapeDatabaseEntity> = {
      ...scrapeInitRecord,
      ...insertResult.generatedMaps[0],
    };

    return result;
  }

  async registerScrapeDataResult(params: {
    scrape: {
      id: number;
      pageName: string;
    };
    scrapeData: {
      linkName: string;
      link: string;
    }[];
  }): Promise<ScrapeDataDatabaseEntity> {
    const { scrape, scrapeData } = params;

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const updatedScrapeRecord: Partial<ScrapeDatabaseEntity> = {
        ...scrape,
        status: 'success',
      };
      await transactionalEntityManager.update(
        ScrapeDatabaseEntity,
        { id: scrape.id },
        updatedScrapeRecord,
      );

      const mappedScrapeData = scrapeData.map<
        Partial<ScrapeDataDatabaseEntity>
      >((data) => ({
        ...data,
        scrape: scrape.id,
      }));
      await transactionalEntityManager.insert(ScrapeDataDatabaseEntity, [
        ...mappedScrapeData,
      ]);
    });

    return;
  }
}
