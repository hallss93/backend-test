import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { IsInt, MinLength, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { LogRO } from './logs.ro';

@Entity()
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: new Date().toISOString() })
  @ApiProperty()
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
  date: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3, {
    context: {
      errorCode: 10001,
      value: 3,
    },
  })
  description: string;

  @ManyToOne((type) => User, (u) => u.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  @IsInt({
    message: '$property deve ser um número',
    context: {
      errorCode: 10003,
    },
  })
  user: number;

  toResponseObject(): LogRO {
    const { id, date, description, user } = this;
    const responseObject: LogRO = {
      id,
      date,
      description,
      user,
    };

    return responseObject;
  }

  @BeforeInsert()
  async setDate() {
    this.date = new Date().toISOString();
  }
}
