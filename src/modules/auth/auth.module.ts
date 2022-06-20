import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import 'dotenv/config';
import { JWTStrategy } from './strategies/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { ResetPasswordRequestEntity } from './entities/reset-password-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ResetPasswordRequestEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailerModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  exports: [PassportModule, JWTStrategy, AuthService]
})
export class AuthModule { }
