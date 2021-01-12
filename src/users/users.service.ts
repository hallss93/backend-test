import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogsService } from 'src/log/logs.services';
import { Repository, DeleteResult } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './users.dto';
import { UserRO } from './users.ro';
interface UserCount {
  data: User[];
  total: Number;
}
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logsService: LogsService,
  ) {}
  public async findAll(skip: number, take: number): Promise<UserCount | any> {
    return await this.userRepository.findAndCount({
      take,
      skip,
    });
  }

  public async findByEmail(userEmail: string): Promise<User | null> {
    return await this.userRepository.findOne({ email: userEmail });
  }

  public async findById(id: number): Promise<UserRO | null> {
    return (await this.userRepository.findOneOrFail(id)).toResponseObject();
  }

  public async create(user: CreateUserDto): Promise<User | any> {
    const newUser = this.userRepository.create(user);
    await newUser.save();
    this.logsService.create({
      user: newUser.id,
      description: 'Cadastro',
    });
    return newUser.toResponseObject();
  }

  public async update(
    id: number,
    newValue: CreateUserDto,
  ): Promise<UserRO | null> {
    const user = await this.userRepository.findOneOrFail(id);
    if (!user.id) {
      // tslint:disable-next-line:no-console
      console.error("user doesn't exist");
    }
    const newUser = await this.userRepository.create(newValue);
    await this.userRepository.update(id, newUser);
    const find = await this.userRepository.findOne(id);
    return find.toResponseObject();
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  public async register(CreateUserDto: CreateUserDto): Promise<User> {
    const { email } = CreateUserDto;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = this.userRepository.create(CreateUserDto);
    return await this.userRepository.save(user);
  }
}
