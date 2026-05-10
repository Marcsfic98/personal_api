import { AuthService } from './../service/auth.service';
import { User } from './../../user/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { GoogleOAuthGuard } from '../guard/google-oauth.guard';

@Controller('/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() user: User): Promise<any> {
    return this.authService.login(user);
  }

  @Get('/auth/google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: any) {
    // Esta rota inicia o fluxo de autenticação do Google
  }

  @Get('/auth/google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: any) {
    return this.authService.googleLogin(req.user);
  }
}
