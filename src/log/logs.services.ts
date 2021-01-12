import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { Log } from './logs.entity';
import { LogRO } from './logs.ro';
@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
  ) {}

  public async findAll(): Promise<Log[]> {
    return await this.logsRepository.find();
  }

  public async findById(id: number): Promise<LogRO> {
    return (await this.logsRepository.findOneOrFail(id)).toResponseObject();
  }

  public async create(log: LogRO): Promise<Log | any> {
    const newLog = this.logsRepository.create(log);
    await newLog.save();
    return newLog;
  }

  public async update(id: number, newValue: Log): Promise<LogRO | null> {
    const log = await this.logsRepository.findOneOrFail(id);
    if (!log.id) {
      // tslint:disable-next-line:no-console
      console.error("log doesn't exist");
    }
    const newLog = this.logsRepository.create(newValue);
    await this.logsRepository.update(id, newLog);
    const find = await this.logsRepository.findOne(id);
    return find.toResponseObject();
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.logsRepository.delete(id);
  }
}
