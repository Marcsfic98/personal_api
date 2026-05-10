import { AuthService } from './../service/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private _usernameField: string;
  private _passwordField: string;

  constructor(private readonly authService: AuthService) {
    super();
    this._usernameField = 'email';
    this._passwordField = 'password';
  }

  async validate(email: string, password: string): Promise<any> {
    const validUser = await this.authService.validateUser(email, password);
    if (!validUser) {
      throw new UnauthorizedException('Usuário e/ou senha incorretos!');
    }
    return validUser;
  }
}
