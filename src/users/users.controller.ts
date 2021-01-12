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

import { UsersService } from './users.service';
import { UserPagination } from 'src/users/users.dto';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { UserRO } from './users.ro';

import { User } from './user.entity';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  @UseInterceptors(PaginationInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: UserPagination, isArray: false })
  async getHello(
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<UserPagination[]> {
    return this.userService.findAll(page, size);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  getUser(@Param('id') id: number): Promise<UserRO> {
    return this.userService.findById(id);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async postUser(@Body(ValidationPipe) user: User): Promise<User | any> {
    return await this.userService.create(user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@Param('id') id: number): Promise<DeleteResult> {
    return this.userService.delete(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  putUser(
    @Param('id') id: number,
    @Body() user: User,
  ): Promise<UserRO> {
    return this.userService.update(id, user);
  }
}
