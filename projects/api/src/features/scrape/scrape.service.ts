import { Injectable } from '@nestjs/common';
import { ScrapeProducer } from './gateways/queue/scrapes/scrape.producer';
import { ScrapeQueriesDAO } from './gateways/database/scrape-queries.dao';
import { ScrapeDataDatabaseEntity } from './gateways/database/entities/scrape-data.entity';
import { GetScrapeResultResponseDTO } from './entrypoints/rest/dtos/response/get-scrape-result-response.dto';
import { ScrapeOperationsDAO } from './gateways/database/scrape-operations.dao';

@Injectable()
export class ScrapeService {
  constructor(
    private scrapeProducer: ScrapeProducer,
    private scrapeQueriesDAO: ScrapeQueriesDAO,
    private scrapeOperationsDAO: ScrapeOperationsDAO,
  ) {}

  async scrapePage(params: { page: string; userId: number }): Promise<void> {
    const { page, userId } = params;

    const newScrapeRecord = await this.scrapeOperationsDAO.registerScrapeInit({
      page,
      userId,
    });

    await this.scrapeProducer.produceScrapeJob({
      scrapeId: newScrapeRecord.id,
      page,
    });

    return;
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
  }): Promise<void> {
    const { scrape, scrapeData } = params;

    await this.scrapeOperationsDAO.registerScrapeDataResult({
      scrape,
      scrapeData,
    });

    return;
  }

  async getScrapeResult(params: {
    scrapeId: number;
    userId: number;
  }): Promise<ScrapeDataDatabaseEntity> {
    const { scrapeId, userId } = params;

    const result = await this.scrapeQueriesDAO.getScrapeResult({
      scrapeId,
      userId,
    });

    return result;
  }

  async getScrapeSummary(params: {
    userId: number;
  }): Promise<GetScrapeResultResponseDTO> {
    const { userId } = params;

    const result = await this.scrapeQueriesDAO.getScrapeSummary({
      userId,
    });

    // TODO: fix return format

    return;
  }
}
