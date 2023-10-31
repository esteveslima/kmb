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
  UseGuards,
} from '@nestjs/common';
import { ScrapeService } from '../../scrape.service';
import { ScrapePageRequestDTO } from './dtos/request/scrape-page-request.dto';
import { GetScrapeResultRequestDTO } from './dtos/request/get-scrape-result-request.dto';
import { GetScrapeResultResponseDTO } from './dtos/response/get-scrape-result-response.dto';
import { GetScrapeSummaryResponseDTO } from './dtos/response/get-scrape-summary-response.dto';
import { AuthGuard } from '../../../user/infrastructure/internals/guards/auth.guard';
import { GetAuthData } from '../../../user/infrastructure/internals/decorators/get-auth-data.decorator';
import { TokenPayload } from '../../../user/user.service';

@Controller('/scrape')
@UseGuards(AuthGuard)
export class ScrapeController {
  constructor(private scrapeService: ScrapeService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async scrapePage(
    @Body() params: ScrapePageRequestDTO,
    @GetAuthData() authPayload: TokenPayload,
  ): Promise<void> {
    try {
      const { page } = params;
      const { userId } = authPayload;

      return await this.scrapeService.scrapePage({ page, userId });
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
    @GetAuthData() authPayload: TokenPayload,
  ): Promise<GetScrapeResultResponseDTO> {
    try {
      const { id } = params;
      const { userId } = authPayload;

      return await this.scrapeService.getScrapeResult({
        scrapeId: +id,
        userId,
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
  async getScrapeSummary(
    @GetAuthData() authPayload: TokenPayload,
  ): Promise<GetScrapeSummaryResponseDTO> {
    try {
      const { userId } = authPayload;

      return await this.scrapeService.getScrapeSummary({
        userId,
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
