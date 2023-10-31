import { IsNotEmpty } from 'class-validator';

export class GetScrapeResultRequestDTO {
  @IsNotEmpty()
  scrapeId: number;
}
