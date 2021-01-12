import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BaseEntity,
  BeforeUpdate,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { validateOrReject, IsInt, MinLength, MaxLength } from 'class-validator';
import { User } from '../users/user.entity';
import { TokensRO } from './tokens.ro';

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (u) => u.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  @IsInt({
    message: '$property deve ser um número',
    context: {
      errorCode: 10003,
    },
  })
  user: number;

  @Column({ length: 500 })
  @MinLength(8, {
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
  token: string;

  toResponseObject(showToken: boolean = true): TokensRO {
    const { id, user, token } = this;
    const responseObject: TokensRO = {
      id,
      user,
      token,
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
