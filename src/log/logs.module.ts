import { Module } from '@nestjs/common';
import { LogsService } from './logs.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
