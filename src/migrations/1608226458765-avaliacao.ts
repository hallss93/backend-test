import {
  getRepository,
  MigrationInterface,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Chance } from 'chance';
import { InjectRepository } from '@nestjs/typeorm';
import { Avaliacao } from 'src/avaliacao/avaliacao.entity';
var chance = new Chance();

export class avaliacao1608226458765 implements MigrationInterface {
  constructor(
    @InjectRepository(Avaliacao)
    private readonly avaliacaoRepository: Repository<Avaliacao>,
  ) {}
  public async up(queryRunner: QueryRunner): Promise<void> {
    let promises: Promise<any>[] = [];
    for (var i = 0; i <= 100; i++) {
      for (var j = 0; j <= 10; j++) {
        const avaliacao = {
          local: i + 1,
          rating: chance.integer({ min: 0, max: 5 }),
          comment: chance.sentence({
            words: chance.integer({ min: 5, max: 15 }),
          }),
        };
        promises.push(
          new Promise(async (resolve) => {
            const avaliacaoC = getRepository(Avaliacao).create(avaliacao);

            resolve(await getRepository(Avaliacao).save(avaliacaoC));
          }),
        );
      }
    }

    await Promise.all(promises);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
