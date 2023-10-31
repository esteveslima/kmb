import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ScrapeDataDatabaseEntity } from './entities/scrape-data.entity';
import { InjectRepository } from '@nestjs/typeorm';

export type ScrapeSummary = ScrapeDataDatabaseEntity & { dataCount: number };

@Injectable()
export class ScrapeQueriesDAO {
  constructor(
    @InjectRepository(ScrapeDataDatabaseEntity)
    private scrapeDataRepository: Repository<ScrapeDataDatabaseEntity>,
  ) {}

  async getScrapeResult(params: {
    scrapeId: number;
    userId: number;
  }): Promise<ScrapeDataDatabaseEntity> {
    const { scrapeId, userId } = params;

    const query = this.scrapeDataRepository.createQueryBuilder('scrape_data');

    query.innerJoinAndSelect('scrape_data.scrape', 'scrape');
    query.andWhere('scrape_data.scrape = :scrapeId', { scrapeId });

    query.innerJoinAndSelect('scrape.user', 'user');
    query.andWhere('scrape.user = :userId', { userId });

    const result = await query.getOneOrFail();

    return result;
  }

  async getScrapeSummary(params: { userId: number }): Promise<any> {
    const { userId } = params;

    const query = this.scrapeDataRepository.createQueryBuilder('scrape_data');

    query.select('scrape.*, COUNT(scrape.id) as dataCount');

    query.innerJoinAndSelect('scrape_data.scrape', 'scrape');

    query.innerJoinAndSelect('scrape.user', 'user');
    query.andWhere('scrape.user = :userId', { userId });

    query.groupBy('scrape.id');

    const result = await query.getRawMany();

    return result;
  }
}
