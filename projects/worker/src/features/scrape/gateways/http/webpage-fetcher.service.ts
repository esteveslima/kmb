import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WebpageFetcherService {
  constructor(private readonly httpService: HttpService) {}

  async fetchWebpage(page: string): Promise<string> {
    const response = await lastValueFrom(this.httpService.get<string>(page));

    const { data } = response;

    return data;
  }
}
