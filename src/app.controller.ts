import { Controller, Get, Headers } from '@nestjs/common';
import { BaseException, Errors } from './constants/error.constant';
import { I18nCustomService } from './i18n/i18n.service';

@Controller()
export class AppController {
  constructor(
    private readonly i18n: I18nCustomService,
  ) { }

  @Get()
  async getHello(@Headers() headers: any,) {
    throw new BaseException(Errors.ITEM_NOT_FOUND(await this.i18n.t('text.ok')))
  }
}
