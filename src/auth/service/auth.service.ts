import { UserService } from './../../user/service/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Bcrypt } from '../bcrypt/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const findUser = await this.userService.findByEmail(email);

    if (!findUser) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    const matchPassword = await this.bcrypt.comparePasswords(
      password,
      findUser.password,
    );

    if (matchPassword) {
      // Remove o campo 'password' (singular) da resposta
      const { password, ...result } = findUser;
      return result;
    }

    // Se a senha não bater
    throw new HttpException('Senha incorreta!', HttpStatus.UNAUTHORIZED);
  }

  async login(userLogin: any) {
    // O payload geralmente usa o ID ou E-mail
    const payload = {
      email: userLogin.email,
      sub: userLogin.id,
    };

    return {
      id: userLogin.id,
      name: userLogin.name,
      email: userLogin.email,
      image: userLogin.image,
      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }

  async googleLogin(googleUser: any) {
    try {
      // Procura pelo usuário existente
      const user = await this.userService.findByEmail(googleUser.email);

      if (user) {
        // Se o usuário existe, atualiza a imagem se necessário
        if (googleUser.picture && user.image !== googleUser.picture) {
          user.image = googleUser.picture;
          await this.userService.updateWithoutPassword(user);
        }
        return this.login(user);
      }

      // Se não existe, cria um novo usuário
      const newUser = {
        email: googleUser.email,
        name: `${googleUser.firstName} ${googleUser.lastName}`,
        emailVerified: googleUser.email,
        image: googleUser.picture,
        password: null, // Usuários do Google não têm senha
      };

      const createdUser = await this.userService.createGoogleUser(newUser);
      return this.login(createdUser);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao processar login com Google',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
