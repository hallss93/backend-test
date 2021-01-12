import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BaseEntity,
  OneToOne,
  BeforeUpdate,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IsInt,
  IsEmail,
  MinLength,
  IsDateString,
  IsPhoneNumber,
  IsNotEmpty,
  ValidateIf,
  IsBoolean,
  Length,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

import { UserRO } from './users.ro';
import { Token } from './../token/token.entity';
import { Log } from '../log/logs.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueOnDatabase } from 'src/pipe/uniqueValidation';
import { Local } from 'src/local/local.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @OneToOne(() => Token, (t) => t.user)
  @OneToOne(() => Local, (t) => t.user)
  @OneToOne(() => Log, (l) => l.user)
  id: number;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3, {
    context: {
      errorCode: 10001,
      value: 3,
    },
  })
  name: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  @Length(11, 14, {
    context: {
      errorCode: 10001,
      value: 3,
    },
  })
  @UniqueOnDatabase(User)
  doc1: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  doc2: string;

  @Column()
  @ApiProperty()
  @IsInt({
    context: {
      errorCode: 10003,
    },
  })
  type: number;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  @IsInt({
    context: {
      errorCode: 10003,
    },
  })
  occupation: number;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  dateBirth: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  passport: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  @ValidateIf((o) => o.passport)
  @IsDateString({
    context: {
      errorCode: 10005,
    },
  })
  @IsNotEmpty({
    context: {
      errorCode: 10007,
    },
  })
  validity: string;

  @Column()
  @ApiProperty()
  @MinLength(8, {
    context: {
      errorCode: 10001,
      value: 8,
    },
  })
  cep: string;

  @Column()
  @ApiProperty()
  @MinLength(4, {
    context: {
      errorCode: 10001,
      value: 4,
    },
  })
  address: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  number: string;

  @Column()
  @ApiProperty()
  @MinLength(2, {
    context: {
      errorCode: 10001,
      value: 2,
    },
  })
  neighborhood: string;

  @Column()
  @ApiProperty()
  @MinLength(3, {
    context: {
      errorCode: 10001,
      value: 3,
    },
  })
  city: string;

  @Column()
  @ApiProperty()
  @MinLength(2, {
    context: {
      errorCode: 10001,
      value: 2,
    },
  })
  uf: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  complement: string;

  @Column()
  @ApiProperty()
  @IsEmail(
    {},
    {
      context: {
        errorCode: 10004,
      },
    },
  )
  @Unique('emailUnique', ['email'])
  @UniqueOnDatabase(User)
  email: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  phoneHome: string;

  @Column()
  @ApiProperty()
  @IsPhoneNumber('BR', {
    context: {
      errorCode: 10003,
    },
  })
  phoneMobile: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  obs: string;

  @Column()
  @ApiProperty()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async formatValues() {
    this.password = await bcrypt.hash('123456', 10);
    if (this.doc1) this.doc1 = this.doc1.replace(/\D/g, '');
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(): UserRO {
    const {
      id,
      name,
      doc1,
      doc2,
      type,
      occupation,
      dateBirth,
      passport,
      validity,
      cep,
      address,
      number,
      neighborhood,
      city,
      uf,
      complement,
      email,
      phoneHome,
      phoneMobile,
      obs,
    } = this;
    const responseObject: UserRO = {
      id,
      address,
      cep,
      city,
      complement,
      dateBirth,
      doc1,
      doc2,
      email,
      name,
      neighborhood,
      number,
      obs,
      occupation,
      passport,
      phoneHome,
      phoneMobile,
      type,
      uf,
      validity,
    };

    return responseObject;
  }
}
