import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Local } from './local.entity';
import { CreateLocalDto } from './locals.dto';
import { LocalsRO } from './locals.ro';
interface LocalCount {
  data: Local[];
  total: Number;
}
@Injectable()
export class LocalsService {
  constructor(
    @InjectRepository(Local)
    private readonly localRepository: Repository<Local>,
  ) {}

  public async findAll(skip: number, take: number): Promise<LocalCount | any> {
    return await this.localRepository.findAndCount({
      take,
      skip,
    });
  }

  public async create(local: LocalsRO): Promise<Local | any> {
    const newLocal = this.localRepository.create(local);
    await newLocal.save();
    return newLocal.toResponseObject();
  }

  public async findById(id: number): Promise<LocalsRO | null> {
    return (await this.localRepository.findOneOrFail(id)).toResponseObject();
  }

  public async update(
    id: number,
    newValue: CreateLocalDto,
  ): Promise<LocalsRO | null> {
    const local = await this.localRepository.findOneOrFail(id);
    if (!local.id) {
      // tslint:disable-next-line:no-console
      console.error("local doesn't exist");
    }
    const newLocal = await this.localRepository.create(newValue);
    await this.localRepository.update(id, newLocal);
    const find = await this.localRepository.findOne(id);
    return find.toResponseObject();
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.localRepository.delete(id);
  }
}
