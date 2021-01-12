import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './../interfaces/local.strategy';
import { JwtStrategy } from './../interfaces/jwt.strategy';
import { AuthController } from './auth.controller';
import { TokensModule } from 'src/token/tokens.module';
import { User } from 'src/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from 'src/log/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    TokensModule,
    PassportModule,
    LogsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
