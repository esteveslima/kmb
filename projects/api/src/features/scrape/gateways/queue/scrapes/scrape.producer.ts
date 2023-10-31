import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

interface ScrapeJobPayload {
  page: string;
  scrapeId: number;
}

@Injectable()
export class ScrapeProducer {
  constructor(
    @InjectQueue(process.env.QUEUE_SCRAPE_NAME)
    private queue: Queue<ScrapeJobPayload>,
  ) {}

  async produceScrapeJob(params: ScrapeJobPayload): Promise<void> {
    const { page, scrapeId } = params;

    const job = await this.queue.add({ page, scrapeId });

    return;
  }
}
