import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { UsersModule } from 'src/users/users.module';
import { CartsModule } from 'src/carts/carts.module';
import { Cart } from 'src/carts/entities/cart.entity';
import { PasswordChangeRequest } from './entities/password-change-request.entity';
import { EmailVerificationPending } from './entities/email-verification-pending.entity';
import { AuthRepository } from './repository/auth.repository';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User, Cart, PasswordChangeRequest, EmailVerificationPending]),
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET!,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION! },
    }),
    AccountsModule,
    UsersModule,
    CartsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
  ]
})
export class AuthModule { }
