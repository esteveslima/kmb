import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { ScrapeService } from '../../scrape.service';
import { ScrapePageRequestDTO } from './dtos/request/scrape-page-request.dto';
import { GetScrapeResultRequestDTO } from './dtos/request/get-scrape-result-request.dto';
import { GetScrapeResultResponseDTO } from './dtos/response/get-scrape-result-response.dto';
import { GetScrapeSummaryResponseDTO } from './dtos/response/get-scrape-summary-response.dto';

@Controller('/scrape')
export class ScrapeController {
  constructor(private scrapeService: ScrapeService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async scrapePage(@Body() params: ScrapePageRequestDTO): Promise<void> {
    try {
      const { page } = params;
      const mockUser = 1;

      return await this.scrapeService.scrapePage({ page, userId: mockUser });
    } catch (exception) {
      console.log(exception);
      if (exception instanceof HttpException) {
        throw exception;
      }
      throw new InternalServerErrorException();
    }
  }

  @Get('/:id')
  async getScrapeResult(
    @Param() params: GetScrapeResultRequestDTO,
  ): Promise<GetScrapeResultResponseDTO> {
    try {
      const { id } = params;
      const mockUser = 2;

      return await this.scrapeService.getScrapeResult({
        scrapeId: id,
        userId: mockUser,
      });
    } catch (exception) {
      console.log(exception);
      if (exception instanceof HttpException) {
        throw exception;
      }
      throw new InternalServerErrorException();
    }
  }

  @Get()
  async getScrapeSummary(): Promise<GetScrapeSummaryResponseDTO> {
    try {
      const mockUser = 2;

      return await this.scrapeService.getScrapeSummary({
        userId: mockUser,
      });
    } catch (exception) {
      console.log(exception);
      if (exception instanceof HttpException) {
        throw exception;
      }
      throw new InternalServerErrorException();
    }
  }
}
