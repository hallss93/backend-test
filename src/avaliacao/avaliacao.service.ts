import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Avaliacao } from './avaliacao.entity';
import { CreateAvaliacaoDto } from './avaliacao.dto';
import { AvaliacaoRO } from './avaliacao.ro';
interface AvaliacaoCount {
  data: Avaliacao[];
  total: Number;
}
@Injectable()
export class AvaliacaoService {
  constructor(
    @InjectRepository(Avaliacao)
    private readonly avaliacaoRepository: Repository<Avaliacao>,
  ) {}

  public async findAll(
    skip: number,
    take: number,
  ): Promise<AvaliacaoCount | any> {
    return await this.avaliacaoRepository.findAndCount({
      take,
      skip,
    });
  }

  public async findAllByLocal(
    local: number,
    skip: number,
    take: number,
  ): Promise<AvaliacaoCount | any> {
    return await this.avaliacaoRepository.findAndCount({
      where: {
        local,
      },
      take,
      skip,
    });
  }

  public async create(avaliacao: AvaliacaoRO): Promise<Avaliacao | any> {
    const newAvaliacao = this.avaliacaoRepository.create(avaliacao);
    await newAvaliacao.save();
    return newAvaliacao.toResponseObject();
  }

  public async findById(id: number): Promise<AvaliacaoRO | null> {
    return (
      await this.avaliacaoRepository.findOneOrFail(id)
    ).toResponseObject();
  }

  public async update(
    id: number,
    newValue: CreateAvaliacaoDto,
  ): Promise<AvaliacaoRO | null> {
    const avaliacao = await this.avaliacaoRepository.findOneOrFail(id);
    if (!avaliacao.id) {
      // tslint:disable-next-line:no-console
      console.error("avaliacao doesn't exist");
    }
    const newAvaliacao = await this.avaliacaoRepository.create(newValue);
    await this.avaliacaoRepository.update(id, newAvaliacao);
    const find = await this.avaliacaoRepository.findOne(id);
    return find.toResponseObject();
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.avaliacaoRepository.delete(id);
  }
}
