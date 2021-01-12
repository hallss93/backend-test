import {
  getRepository,
  MigrationInterface,
  QueryRunner,
  Repository,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Chance } from 'chance';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
var chance = new Chance();

export class user1608226046336 implements MigrationInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  public async up(queryRunner: QueryRunner): Promise<void> {
    let promises: Promise<any>[] = [];
    const firstUser = {
      address: chance.address(),
      cep: chance.postcode(),
      city: chance.city(),
      complement: chance.street(),
      doc1: chance.cpf(),
      email: 'hallison.pm@gmail.com',
      foreign: true,
      occupation: 1,
      name: 'Hallison Pereira Melo',
      neighborhood: chance.locale(),
      number: '123',
      passport: chance.cpf(),
      password: '123456',
      phoneHome: chance.phone(),
      phoneMobile: chance.phone(),
      doc2: chance.cpf(),
      id: 0,
      type: 1,
      uf: chance.province(),
      validity: new Date(chance.date()).toDateString(),
    };
    promises.push(
      new Promise(async (resolve) => {
        const userC = getRepository(User).create(firstUser);

        resolve(await getRepository(User).save(userC));
      }),
    );
    for (var i = 0; i <= 100; i++) {
      const user = {
        address: chance.address(),
        cep: chance.postcode(),
        city: chance.city(),
        complement: chance.street(),
        doc1: chance.cpf(),
        email: chance.email(),
        foreign: true,
        occupation: 1,
        name: chance.name(),
        neighborhood: chance.locale(),
        number: '123',
        passport: chance.cpf(),
        password: '123456',
        phoneHome: chance.phone(),
        phoneMobile: chance.phone(),
        doc2: chance.cpf(),
        id: 0,
        type: 1,
        uf: chance.province(),
        validity: new Date(chance.date()).toDateString(),
      };
      promises.push(
        new Promise(async (resolve) => {
          const userC = getRepository(User).create(user);

          resolve(await getRepository(User).save(userC));
        }),
      );
    }

    await Promise.all(promises);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
