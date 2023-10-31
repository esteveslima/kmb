import { IsNotEmpty } from 'class-validator';

export class ScrapePageRequestDTO {
  @IsNotEmpty()
  page: string;
}
