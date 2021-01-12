import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateLocalDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly user: number;

  @ApiProperty()
  readonly lat: string;

  @ApiProperty()
  readonly lng: string;
}
export class LocalPagination {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  data: CreateLocalDto[];

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
