import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './../interfaces/jwt-payload.interface';
import { User } from 'src/users/user.entity';
import { UserRO } from 'src/users/users.ro';
import { RegistrationStatus } from './../interfaces/registrationStatus.interface';
import { CreateUserDto } from 'src/users/users.dto';
import { uid } from 'rand-token';
import { TokensService } from 'src/token/tokens.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgotPasswordRO } from './forgot.ro';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async register(user: CreateUserDto) {
    let status: RegistrationStatus = {
      success: true,
      message: 'user register',
    };
    try {
      await this.usersService.register(user);
    } catch (err) {
      status = { success: false, message: err };
    }
    return status;
  }

  secretOrKey = 'cheers-password';
  createToken(user: UserRO) {
    const expiresIn = 60 * 60 * 12; /* 12 hours */
    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        type: user.type,
        email: user.email,
      },
      'cheers-password',
      { expiresIn },
    );
    return {
      expiresIn,
      accessToken,
    };
  }

  createRefreshToken(id: number) {
    const token = uid(256);
    this.tokensService.create({ token, user: id, id: 0 });
    return token;
  }

  async validateUserToken(payload: JwtPayload): Promise<UserRO> {
    try {
      return await this.usersService.findById(payload.id);
    } catch (e) {
      throw new HttpException(
        {
          code: HttpStatus.UNAUTHORIZED,
          errors: e,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  async validateUser(email: string, password: string): Promise<UserRO> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.comparePassword(password))) {
      this.logger.log('password check success');
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async forgotPassword(email: string): Promise<ForgotPasswordRO | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // tslint:disable-next-line:no-console
      console.error("user doesn't exist");
      return { code: 500, message: '000' };
    }
    const expiresIn = 60 * 60 * 12; /* 12 hours */
    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: email,
      },
      'cheers-password-forgot-password',
      { expiresIn },
    );

    return { code: 200, message: accessToken };
  }

  public async resetPassword(
    token: string,
    newPassword: string,
    newPassword2: string,
  ): Promise<UserRO | null> {
    try {
      /* verificar se as senhas conferem */

      const verify: User = jwt.verify(
        token,
        'cheers-password-forgot-password',
      ) as User;
      console.log(verify);

      const newUser = await this.userRepository.findOneOrFail(verify.id);
      newUser.password = newPassword;
      const user = await this.usersService.update(verify.id, newUser);

      return user;
    } catch (error) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
