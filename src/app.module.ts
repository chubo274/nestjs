import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IPMiddleware } from './helper/ip.middleware';
import { I18nCustomModule } from './i18n/i18n.module';
import { LoggerMiddleware } from './interceptors/logger.middleware';
import { ActionAdminModule } from './models/action-admin/action-admin.module';
import { UserModule } from './models/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    I18nCustomModule,
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: process.env.FALLBACK_LANGUAGE,
        loaderOptions: {
          path: path.join(__dirname, '../resources/locales'),
          watch: true,
        },
      }),
      resolvers: [
        { use: HeaderResolver, options: ['x-lang'] },
        AcceptLanguageResolver
      ],
    //   inject: [BackendConfigService],
    }),
    // ActionAdminModule,
    // UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerMiddleware,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(IPMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
