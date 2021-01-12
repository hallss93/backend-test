import { Controller, HttpStatus, Response, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './../auth/auth.dto';
import { TokensService } from 'src/token/tokens.service';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordRO } from './forgot.ro';
import { LogsService } from 'src/log/logs.services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly logsService: LogsService,
  ) {}

  @Post('login')
  public async login(@Response() res, @Body() login: LoginUserDto) {
    const user = await this.usersService.findByEmail(login.email);
    if (!user) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'User Not Found',
      });
    } else {
      const valid = await this.authService.validateUser(
        login.email,
        login.password,
      );
      if (!valid) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Password invalid',
        });
      } else {
        const token = this.authService.createToken(user);
        const refreshToken = this.authService.createRefreshToken(user.id);
        this.logsService.create({
          user: user.id,
          description: 'Login',
        });
        return res.status(HttpStatus.OK).json({
          ...user.toResponseObject(),
          accessToken: token.accessToken,
          refreshToken,
        });
      }
    }
  }

  @Post('refreshToken')
  public async refresh(
    @Response() res,
    @Body('refreshToken') refreshToken: string,
  ) {
    const tokenUser = await this.tokensService.findByUserId(refreshToken);
    const user = await this.usersService.findById(tokenUser.user);

    const token = this.authService.createToken(user);
    return res.status(HttpStatus.OK).json({ accessToken: token.accessToken });
  }

  @Post('/forgotPassword')
  async forgotPassword(
    @Body('email') email: string,
  ): Promise<ForgotPasswordRO | any> {
    return await this.authService.forgotPassword(email);
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
    @Body('password2') password2: string,
  ): Promise<ForgotPasswordRO | any> {
    return await this.authService.resetPassword(token, password, password2);
  }
}
