import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateAvaliacaoDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly local: number;

  @ApiProperty()
  readonly rating: number;

  @ApiProperty()
  readonly comment: string;
}
export class AvaliacaoPagination {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  data: CreateAvaliacaoDto[];

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
