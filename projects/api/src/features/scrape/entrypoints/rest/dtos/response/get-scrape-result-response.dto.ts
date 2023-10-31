class ScrapeData {
  linkName: string;
  link: string;
}

export class GetScrapeResultResponseDTO {
  pageName: string;
  scrapeData: ScrapeData[];
}
