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
import { Local } from 'src/local/local.entity';
import { AvaliacaoRO } from './avaliacao.ro';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Avaliacao extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne((type) => Local, (u) => u.id)
  @ApiProperty()
  @JoinColumn()
  @IsInt({
    message: '$property deve ser um número',
    context: {
      errorCode: 10003,
    },
  })
  local: number;

  @Column()
  @ApiProperty()
  @IsInt({
    context: {
      errorCode: 10003,
    },
  })
  rating: number;

  @Column({ length: 500 })
  @ApiProperty()
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
  comment: string;

  toResponseObject(showAvaliacao: boolean = true): AvaliacaoRO {
    const { id, local, rating, comment } = this;
    const responseObject: AvaliacaoRO = {
      id,
      local,
      rating,
      comment,
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
