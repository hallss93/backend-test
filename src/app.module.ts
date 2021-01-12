import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import {
  I18nModule,
  I18nJsonParser,
  QueryResolver,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import { EasyconfigModule } from 'nestjs-easyconfig';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PathResolver } from './path.resolver';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { TokensModule } from './token/tokens.module';
import { Token } from './token/token.entity';
import { Local } from './local/local.entity';
import { Log } from './log/logs.entity';
import { LocalsModule } from './local/locals.module';
import { AvaliacaoModule } from './avaliacao/avaliacao.module';
import { Avaliacao } from './avaliacao/avaliacao.entity';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    TokensModule,
    LocalsModule,
    AvaliacaoModule,
    EasyconfigModule.register({}),
    I18nModule.forRoot({
      fallbackLanguage: 'pt-BR',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
      resolvers: [
        PathResolver,
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        AcceptLanguageResolver,
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: 3306,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [User, Token, Log, Local, Avaliacao],
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: true,
      migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
