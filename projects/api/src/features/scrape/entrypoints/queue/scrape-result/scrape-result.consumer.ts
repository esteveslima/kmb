import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ScrapeService } from '../../../scrape.service';

interface ScrapeDataJobPayload {
  scrape: {
    id: number;
    pageName: string;
  };
  scrapeData: {
    linkName: string;
    link: string;
  }[];
}

interface ScrapeJobResult {
  status: 'success' | 'failure';
  message?: string;
}

@Processor(process.env.QUEUE_SCRAPE_RESULT_NAME)
export class ScrapeResultConsumer {
  constructor(private scrapeService: ScrapeService) {}

  @Process()
  async processScrapeDataResult(
    job: Job<ScrapeDataJobPayload>,
  ): Promise<ScrapeJobResult> {
    const { scrape, scrapeData } = job.data;

    try {
      await this.scrapeService.registerScrapeDataResult({ scrape, scrapeData });
      return { status: 'success' };
    } catch (exception) {
      await this.scrapeService.registerScrapeDataFailure({ scrape });
      return { status: 'failure', message: exception.toString() };
    }
  }
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));
