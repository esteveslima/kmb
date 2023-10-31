import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ScrapeService } from '../../../scrape.service';
import { ScrapeDatabaseEntity } from '../../../gateways/database/entities/scrape.entity';
import { ScrapeDataDatabaseEntity } from '../../../gateways/database/entities/scrape-data.entity';

interface ScrapeDataJobPayload {
  scrape: ScrapeDatabaseEntity;
  scrapeData: ScrapeDataDatabaseEntity[];
}

interface ScrapeJobResult {
  status: 'success' | 'failure';
  message?: string;
}

@Processor(process.env.QUEUE_NAME)
export class ScrapeConsumer {
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
      return { status: 'failure', message: exception.toString() };
    }
  }
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));
