import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { v4 as uuidv4 } from 'uuid';
import { CookieOptions, Request, Response } from 'express';
import { AuthUser } from 'src/core/types/global.types';
import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/repository/user.repository';
import { CartsRepository } from 'src/carts/repository/carts.repository';
import { AccountsRepository } from 'src/accounts/repository/account.repository';
import { Cart } from 'src/carts/entities/cart.entity';
require('dotenv').config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account) private accountsRepo: Repository<Account>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Cart) private cartsRepo: Repository<Cart>,
    private jwtService: JwtService,
    private userRepository: UsersRepository,
    private cartsReposiory: CartsRepository,
    private accountRepository: AccountsRepository,
  ) { }

  async signIn(signInDto: SignInDto) {
    const foundAccount = await this.accountsRepo.findOne({
      where: {
        email: signInDto.email,
      },
      relations: {
        user: true,
      }
    });

    if (!foundAccount)
      throw new UnauthorizedException(
        'This email is not registered. Please register first.',
      );

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      foundAccount.password,
    );

    if (!isPasswordValid) throw new BadRequestException('Invalid password');

    const payload: AuthUser = {
      email: foundAccount.email,
      accountId: foundAccount.id,
      userId: foundAccount.user.id,
      name: foundAccount.firstName + ' ' + foundAccount.lastName,
      role: foundAccount.role,
    };

    const access_token = await this.createAccessToken(payload);

    const refresh_token = await this.createRefreshToken(foundAccount.id);

    foundAccount.refresh_token = refresh_token;

    await this.accountsRepo.save(foundAccount);

    return { access_token, refresh_token };
  }

  async createAccessToken(payload: AuthUser) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '1m',
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async createRefreshToken(userId: string) {
    const tokenId = uuidv4();
    return await this.jwtService.signAsync(
      { id: userId, tokenId: tokenId },
      { expiresIn: '7d', secret: process.env.REFRESH_TOKEN_SECRET },
    );
  }

  async register(registerDto: RegisterDto) {
    const foundAccount = await this.accountsRepo.findOneBy({
      email: registerDto.email,
    });

    if (foundAccount) throw new BadRequestException('User with this email already exists');

    const newAccount = this.accountsRepo.create(registerDto);

    const savedAccount = await this.accountRepository.insert(newAccount); // ensure transaction

    const newUser = this.usersRepo.create({
      account: savedAccount,
    });

    const savedUser = await this.userRepository.createUser(newUser);

    const cart = this.cartsRepo.create({
      user: savedUser,
    })

    await this.cartsReposiory.createCart(cart);

    return {
      message: 'User created',
      user: {
        id: newAccount.id,
        email: newAccount.email,
        name: newAccount.firstName + ' ' + newAccount.lastName,
      },
    };
  }

  async refresh(refresh_token: string) {
    // verifying the refresh token
    const decoded = await this.jwtService.verifyAsync(refresh_token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    if (!decoded) throw new ForbiddenException('Invalid token');

    // Is refresh token in db?
    const foundAccount = await this.accountsRepo.findOne({
      where: {
        refresh_token,
        id: decoded.id,
      },
      relations: {
        user: true
      }
    });

    if (!foundAccount) throw new UnauthorizedException('Access Denied');

    // create new access token & refresh token
    const payload: AuthUser = {
      email: foundAccount.email,
      accountId: foundAccount.id,
      userId: foundAccount.user.id,
      name: foundAccount.firstName + ' ' + foundAccount.lastName,
      role: foundAccount.role,
    };

    const new_access_token = await this.createAccessToken(payload);
    const new_refresh_token = await this.createRefreshToken(foundAccount.id);

    // saving refresh_token with current user
    foundAccount.refresh_token = new_refresh_token;
    await this.accountsRepo.save(foundAccount);

    return {
      new_access_token,
      new_refresh_token,
    };
  }

  async logout(
    refresh_token: string,
    res: Response,
    cookieOptions: CookieOptions,
  ) {
    // Is refresh token in db?
    const foundAccount = await this.accountsRepo.findOneBy({ refresh_token });

    if (!foundAccount) {
      res.clearCookie('refresh_token', cookieOptions);
      return res.sendStatus(204);
    }

    // delete refresh token in db
    foundAccount.refresh_token = null;
    await this.accountsRepo.save(foundAccount);
  }
}
