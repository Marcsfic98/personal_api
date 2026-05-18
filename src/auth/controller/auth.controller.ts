import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { GoogleOAuthGuard } from '../guard/google-oauth.guard';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../service/auth.service';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Get('auth/google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: Request) {
    // Inicia o fluxo de autenticação com Google
  }

  @Get('auth/google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);
    const token = result.token;
    return res.redirect(`http://localhost:5173/callback?token=${token}`);
  }
}
