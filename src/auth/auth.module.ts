import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Account } from 'src/accounts/entities/account.entity';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET!,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION! },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
  ]
})
export class AuthModule { }
