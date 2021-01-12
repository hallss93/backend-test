import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avaliacao } from './avaliacao.entity';
import { AvaliacaoController } from './avaliacao.controller';
import { LogsModule } from 'src/log/logs.module';
import { LogMiddleware } from 'src/log/logs.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Avaliacao]), LogsModule],
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService],
  exports: [AvaliacaoService],
})
export class AvaliacaoModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
