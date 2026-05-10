import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <--- ADICIONE ESTA LINHA
import { UserModule } from './../user/user.module';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { jwtConstants } from './constants/constants';
import { Bcrypt } from './bcrypt/bcrypt';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule, // Agora o TypeScript vai reconhecer
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [Bcrypt, AuthService, LocalStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [Bcrypt, AuthService], // Exportar AuthService também é uma boa prática
})
export class AuthModule {}
