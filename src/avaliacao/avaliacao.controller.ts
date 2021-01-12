import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { AvaliacaoService } from './avaliacao.service';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { AvaliacaoRO } from './avaliacao.ro';

import { Avaliacao } from './avaliacao.entity';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';
import { AvaliacaoPagination } from './avaliacao.dto';

@ApiTags('avaliacao')
@Controller('avaliacao')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Get('/')
  @UseInterceptors(PaginationInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: AvaliacaoPagination, isArray: false })
  async getHello(
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<AvaliacaoPagination[]> {
    return this.avaliacaoService.findAll(page, size);
  }

  @Get('/:local_id')
  @UseInterceptors(PaginationInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: AvaliacaoPagination, isArray: false })
  async getLocal(
    @Param('local_id') local_id: number,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<AvaliacaoPagination[]> {
    return this.avaliacaoService.findAllByLocal(local_id, page, size);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  getAvaliacao(@Param('id') id: number): Promise<AvaliacaoRO> {
    return this.avaliacaoService.findById(id);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async postAvaliacao(
    @Body(ValidationPipe) avaliacao: Avaliacao,
  ): Promise<Avaliacao | any> {
    return await this.avaliacaoService.create(avaliacao);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteAvaliacao(@Param('id') id: number): Promise<DeleteResult> {
    return this.avaliacaoService.delete(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  putAvaliacao(
    @Param('id') id: number,
    @Body(ValidationPipe) avaliacao: Avaliacao,
  ): Promise<AvaliacaoRO> {
    return this.avaliacaoService.update(id, avaliacao);
  }
}
