import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ScrapeDataDatabaseEntity } from './entities/scrape-data.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ScrapeDatabaseEntity } from './entities/scrape.entity';

export type ScrapeSummary = ScrapeDataDatabaseEntity & { dataCount: number };

@Injectable()
export class ScrapeQueriesDAO {
  constructor(
    @InjectRepository(ScrapeDatabaseEntity)
    private scrapeRepository: Repository<ScrapeDatabaseEntity>,
  ) {}

  async getScrapeResult(params: {
    scrapeId: number;
    userId: number;
  }): Promise<ScrapeDatabaseEntity> {
    const { scrapeId, userId } = params;

    try {
      const result = await this.scrapeRepository.findOneOrFail({
        where: { id: scrapeId, user: userId },
        relations: { scrapeData: true },
      });
      return result;
    } catch (exception) {
      console.log(exception);
      throw new NotFoundException('Scrape not found for user'); // throwing http exception directly to save time
    }
  }

  async getScrapeSummary(params: {
    userId: number;
  }): Promise<ScrapeDatabaseEntity[]> {
    // Ideally it would be better to customize the query with GroupBy and Count to avoid fetching all the records and counting in code
    // Unfortunatelly I couldn't find how to do it fast enough, so I'm sticking with this simple solution
    const { userId } = params;

    const result = await this.scrapeRepository.find({
      where: { user: userId },
      relations: { scrapeData: true },
    });

    // const query = this.scrapeRepository.createQueryBuilder('scrape');

    // query.innerJoinAndSelect('scrape.scrapeData', 'scrape_data');
    // query.andWhere('scrape.user = :userId', { userId });

    // const result = await query.getMany();

    return result;
  }
}
