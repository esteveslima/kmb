import { Injectable } from '@nestjs/common';
import { WebpageFetcherService } from './gateways/http/webpage-fetcher.service';
import { ScrapeResultProducer } from './gateways/queue/scrapes/scrape-result.producer';

@Injectable()
export class ScrapeService {
  constructor(
    private webpageFetcherService: WebpageFetcherService,
    private scrapeResultProducer: ScrapeResultProducer,
  ) {}

  async handlePageScraping(params: {
    page: string;
    scrapeId: number;
  }): Promise<void> {
    const { page, scrapeId } = params;

    const htmlPage = await this.webpageFetcherService.fetchWebpage(page);

    const regexHtmlTitleTag = /<title\s*.*?>\s*.*?<\/title>/g;
    const htmlTitleTag = htmlPage.match(regexHtmlTitleTag)[0];
    const prunedHtmlTitleTag = htmlTitleTag
      .replace(`<title`, '')
      .replace(`</title>`, '');
    const htmlTitleTagSeparatorIndex = prunedHtmlTitleTag.indexOf('>');
    const pageTitle = prunedHtmlTitleTag.slice(
      htmlTitleTagSeparatorIndex + 1,
      prunedHtmlTitleTag.length,
    );

    const regexHtmlLinkTag = /<a\s*.*?>\s*.*?<\/a>/g;
    const htmlLinkTags = htmlPage.match(regexHtmlLinkTag);

    const scrapeData = htmlLinkTags.map((htmlTag) => {
      const prunedHtmlLinkTag = htmlTag.replace(`<a`, '').replace(`</a>`, '');
      const htmlLinkTagSeparatorIndex = prunedHtmlLinkTag.indexOf('>');

      const tagProperties = prunedHtmlLinkTag.slice(
        0,
        htmlLinkTagSeparatorIndex,
      );
      const tagValue = prunedHtmlLinkTag.slice(
        htmlLinkTagSeparatorIndex + 1,
        prunedHtmlLinkTag.length,
      );

      const hrefValue = tagProperties
        .split(' ')
        .find((prop) => prop.includes(`href="`))
        .replace('href=', '')
        .replace(/"|'|`/, '');

      const isTagValueHtmlTag = tagValue[0] === '<';
      const formattedTagValue = isTagValueHtmlTag
        ? tagValue.slice(0, 15)
        : tagValue;

      return {
        link: hrefValue,
        linkName: formattedTagValue,
      };
    });

    await this.scrapeResultProducer.produceScrapeDataJob({
      scrape: {
        id: scrapeId,
        pageName: pageTitle,
      },
      scrapeData,
    });

    return;
  }
}
