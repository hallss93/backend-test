import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BaseEntity,
  BeforeUpdate,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { validateOrReject, IsInt, MinLength, MaxLength } from 'class-validator';
import { User } from '../users/user.entity';
import { LocalsRO } from './locals.ro';
import { Avaliacao } from 'src/avaliacao/avaliacao.entity';

@Entity()
export class Local extends BaseEntity {
  @PrimaryGeneratedColumn()
  @OneToOne(() => Avaliacao, (t) => t.local)
  id: number;

  @ManyToOne((type) => User, (u) => u.id)
  @JoinColumn()
  @IsInt({
    message: '$property deve ser um número',
    context: {
      errorCode: 10003,
    },
  })
  user: number;

  @Column({ length: 500 })
  @MinLength(3, {
    message: '$property deve ter pelo menos $constraint1 caracteres.',
    context: {
      errorCode: 10001,
      value: 8,
    },
  })
  @MaxLength(500, {
    message: '$property deve ter no máximo $constraint1 caracteres.',
    context: {
      errorCode: 10002,
      value: 500,
    },
  })
  lat: string;

  @Column({ length: 500 })
  @MinLength(3, {
    message: '$property deve ter pelo menos $constraint1 caracteres.',
    context: {
      errorCode: 10001,
      value: 8,
    },
  })
  @MaxLength(500, {
    message: '$property deve ter no máximo $constraint1 caracteres.',
    context: {
      errorCode: 10002,
      value: 500,
    },
  })
  lng: string;

  toResponseObject(showLocal: boolean = true): LocalsRO {
    const { id, user, lat, lng } = this;
    const responseObject: LocalsRO = {
      id,
      user,
      lat,
      lng,
    };

    return responseObject;
  }

  @BeforeUpdate()
  @BeforeInsert()
  async validate() {
    try {
      await validateOrReject(this);
    } catch (errors) {
      return errors;
    }
  }
}
