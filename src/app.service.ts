import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n/dist/services/i18n.service';

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nService) {}

  getHello = async ({
    lang,
    name,
  }: {
    lang: string;
    name: string;
  }): Promise<string> => {
    console.log('name', name);
    console.log('lang', lang);
    return await this.i18n.translate('auth.HELLO_MESSAGE', {
      lang,
      args: { username: name },
    });
  };
}
