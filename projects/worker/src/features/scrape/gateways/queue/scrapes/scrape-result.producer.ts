import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

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

@Injectable()
export class ScrapeResultProducer {
  constructor(
    @InjectQueue(process.env.QUEUE_SCRAPE_RESULT_NAME)
    private queue: Queue<ScrapeDataJobPayload>,
  ) {}

  async produceScrapeDataJob(params: ScrapeDataJobPayload): Promise<void> {
    const { scrape, scrapeData } = params;

    const job = await this.queue.add({ scrape, scrapeData });

    return;
  }
}
