import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate, validateOrReject } from 'class-validator';
import { Repository, DeleteResult } from 'typeorm';
import { Token } from './token.entity';
import { TokensRO } from './tokens.ro';
@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  public async findByUserId(refresToken: string): Promise<Token | null> {
    return await this.tokenRepository.findOneOrFail({
      where: {
        token: refresToken,
      },
    });
  }

  public async create(user: TokensRO): Promise<Token | any> {
    const newUser = this.tokenRepository.create(user);
    await newUser.save();
    return newUser.toResponseObject();
  }
}
