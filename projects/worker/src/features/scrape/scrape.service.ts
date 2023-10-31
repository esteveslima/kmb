import { Injectable } from '@nestjs/common';
import { WebpageFetcherService } from './gateways/http/webpage-fetcher.service';
import { ScrapeResultProducer } from './gateways/queue/scrapes/scrape-result.producer';

@Injectable()
export class ScrapeService {
  constructor(
    private webpageFetcherService: WebpageFetcherService,
    private scrapeResultProducer: ScrapeResultProducer,
  ) {}

  async handlePageScraping(params: {
    page: string;
    scrapeId: number;
  }): Promise<void> {
    const { page, scrapeId } = params;

    const htmlPage = await this.webpageFetcherService.fetchWebpage(page);

    console.log(htmlPage);

    await this.scrapeResultProducer.produceScrapeDataJob({
      scrape: {
        id: scrapeId,
        pageName: 'mock',
      },
      scrapeData: [
        { link: 'https://mock1.com', linkName: 'mock1' },
        { link: 'https://mock2.com', linkName: 'mock2' },
        { link: 'https://mock3.com', linkName: 'mock3' },
      ],
    });

    return;
  }
}
