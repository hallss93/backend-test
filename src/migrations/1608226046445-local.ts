import {
  getRepository,
  MigrationInterface,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Chance } from 'chance';
import { InjectRepository } from '@nestjs/typeorm';
import { Local } from 'src/local/local.entity';
var chance = new Chance();

export class local1608226046445 implements MigrationInterface {
  constructor(
    @InjectRepository(Local)
    private readonly localRepository: Repository<Local>,
  ) {}
  public async up(queryRunner: QueryRunner): Promise<void> {
    let promises: Promise<any>[] = [];
    for (var i = 0; i <= 100; i++) {
      for (var j = 0; j <= 10; j++) {
        const local = {
          user: i + 1,
          lat: chance.latitude({ fixed: 7 }).toString(),
          lng: chance.longitude({ fixed: 7 }).toString(),
        };
        promises.push(
          new Promise(async (resolve) => {
            const localC = getRepository(Local).create(local);

            resolve(await getRepository(Local).save(localC));
          }),
        );
      }
    }

    await Promise.all(promises);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
