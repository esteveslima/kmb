import { Injectable } from '@nestjs/common';
import { ScrapeProducer } from './gateways/queue/scrapes/scrape.producer';
import { ScrapeQueriesDAO } from './gateways/database/scrape-queries.dao';
import { GetScrapeResultResponseDTO } from './entrypoints/rest/dtos/response/get-scrape-result-response.dto';
import { ScrapeOperationsDAO } from './gateways/database/scrape-operations.dao';
import { GetScrapeSummaryResponseDTO } from './entrypoints/rest/dtos/response/get-scrape-summary-response.dto';

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

  async registerScrapeDataFailure(params: {
    scrape: {
      id: number;
    };
  }): Promise<void> {
    const { scrape } = params;

    await this.scrapeOperationsDAO.registerScrapeDataFailure({
      scrape,
    });

    return;
  }

  async getScrapeResult(params: {
    scrapeId: number;
    userId: number;
  }): Promise<GetScrapeResultResponseDTO> {
    const { scrapeId, userId } = params;

    const result = await this.scrapeQueriesDAO.getScrapeResult({
      scrapeId,
      userId,
    });

    return {
      pageName: result.pageName,
      status: result.status,
      scrapeData: result.scrapeData.map((data) => ({
        link: data.link,
        linkName: data.linkName,
      })),
    };
  }

  async getScrapeSummary(params: {
    userId: number;
  }): Promise<GetScrapeSummaryResponseDTO> {
    const { userId } = params;

    const result = await this.scrapeQueriesDAO.getScrapeSummary({
      userId,
    });

    return {
      summary: result.map((data) => ({
        id: data.id,
        pageName: data.pageName,
        status: data.status,
        totalLinks: data.scrapeData.length,
      })),
    };
  }
}
