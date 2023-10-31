class ScrapeSummaryData {
  pageName: string;
  status: string;
  totalLinks: number;
}

export class GetScrapeSummaryResponseDTO {
  summary: ScrapeSummaryData[];
}
