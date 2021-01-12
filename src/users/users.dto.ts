import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly type: number;

  @ApiProperty()
  readonly occupation: number;

  @ApiProperty()
  readonly passport: string;

  @ApiProperty()
  readonly validity: string;

  @ApiProperty()
  readonly doc1: string;

  @ApiProperty()
  readonly doc2: string;

  @ApiProperty()
  readonly cep: string;

  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly number: string;

  @ApiProperty()
  readonly neighborhood: string;

  @ApiProperty()
  readonly city: string;

  @ApiProperty()
  readonly uf: string;

  @ApiProperty()
  readonly complement: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly phoneHome: string;

  @ApiProperty()
  readonly phoneMobile: string;

  @ApiHideProperty()
  readonly password: string;
}

export class UpdateUserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly type: number;

  @ApiProperty()
  readonly passport: string;

  @ApiProperty()
  readonly validity: string;

  @ApiProperty()
  readonly cpf: string;

  @ApiProperty()
  readonly rg: string;

  @ApiProperty()
  readonly cep: string;

  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly number: string;

  @ApiProperty()
  readonly neighborhood: string;

  @ApiProperty()
  readonly city: string;

  @ApiProperty()
  readonly uf: string;

  @ApiProperty()
  readonly complement: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly phoneHome: string;

  @ApiProperty()
  readonly phoneMobile: string;

  @ApiProperty()
  readonly password: string;
}

export class UserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly type: number;

  @ApiProperty()
  readonly occupation: number;

  @ApiProperty()
  readonly passport: string;

  @ApiProperty()
  readonly validity: string;

  @ApiProperty()
  readonly doc1: string;

  @ApiProperty()
  readonly doc2: string;

  @ApiProperty()
  readonly cep: string;

  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly number: string;

  @ApiProperty()
  readonly neighborhood: string;

  @ApiProperty()
  readonly city: string;

  @ApiProperty()
  readonly uf: string;

  @ApiProperty()
  readonly complement: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly phoneHome: string;

  @ApiProperty()
  readonly phoneMobile: string;
}

export class UserPagination {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  data: UserDto[];

  @ApiProperty()
  pagination: {
    page: number;
    size: number;
    totalItens: number;
    totalPages: number;
    nextPage: number | null;
    previousPage: number | null;
  };
}
