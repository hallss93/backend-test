import { Controller, Get, Query } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(
    @I18n() i18n: I18nContext,
    @Query('name') name: string,
  ): Promise<string> {
    return this.appService.getHello({
      lang: i18n.detectedLanguage,
      name,
    });
  }
}
