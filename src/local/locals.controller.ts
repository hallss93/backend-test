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

import { LocalsService } from './locals.service';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { LocalsRO } from './locals.ro';

import { Local } from './local.entity';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';
import { LocalPagination } from './locals.dto';

@ApiTags('local')
@Controller('local')
export class LocalsController {
  constructor(private readonly localService: LocalsService) {}

  @Get('/')
  @UseInterceptors(PaginationInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: LocalPagination, isArray: false })
  async getHello(
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<LocalPagination[]> {
    return this.localService.findAll(page, size);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  getLocal(@Param('id') id: number): Promise<LocalsRO> {
    return this.localService.findById(id);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async postLocal(@Body(ValidationPipe) local: Local): Promise<Local | any> {
    return await this.localService.create(local);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteLocal(@Param('id') id: number): Promise<DeleteResult> {
    return this.localService.delete(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  putLocal(
    @Param('id') id: number,
    @Body(ValidationPipe) local: Local,
  ): Promise<LocalsRO> {
    return this.localService.update(id, local);
  }
}
