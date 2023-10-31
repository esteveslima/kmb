import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ScrapeService } from '../../../scrape.service';

interface ScrapeJobPayload {
  page: string;
  scrapeId: number;
}

interface ScrapeDataJobResult {
  status: 'success' | 'failure';
  message?: string;
}

@Processor(process.env.QUEUE_SCRAPE_NAME)
export class ScrapeConsumer {
  constructor(private scrapeService: ScrapeService) {}

  @Process()
  async processScrapeJob(
    job: Job<ScrapeJobPayload>,
  ): Promise<ScrapeDataJobResult> {
    const { page, scrapeId } = job.data;
    await sleep(3000); //simulating a processing time for easy visualization in the queue

    try {
      await this.scrapeService.handlePageScraping({ page, scrapeId });
      return { status: 'success' };
    } catch (exception) {
      return { status: 'failure', message: exception.toString() };
    }
  }
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));
