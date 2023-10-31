import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

interface ScrapeJobPayload {
  page: string;
}

@Injectable()
export class ScrapeProducer {
  constructor(
    @InjectQueue(process.env.QUEUE_NAME)
    private queue: Queue<ScrapeJobPayload>,
  ) {}

  async produceScrapeJob(params: ScrapeJobPayload): Promise<void> {
    const { page } = params;

    const job = await this.queue.add({ page });

    return;
  }
}
