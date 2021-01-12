import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LocalsService } from './locals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Local } from './local.entity';
import { LocalsController } from './locals.controller';
import { LogsModule } from 'src/log/logs.module';
import { LogMiddleware } from 'src/log/logs.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Local]), LogsModule],
  controllers: [LocalsController],
  providers: [LocalsService],
  exports: [LocalsService],
})
export class LocalsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
