class ScrapeSummaryData {
  pageName: string;
  totalLinks: number;
}

export class GetScrapeSummaryResponseDTO {
  summary: ScrapeSummaryData[];
}
