import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { CookieOptions, Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { TransactionInterceptor } from 'src/core/interceptors/transaction.interceptor';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { PasswordChangeRequestDto } from './dto/password-change-req.dto';
import { Throttle } from '@nestjs/throttler';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
require('dotenv').config();

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    }

    private readonly refreshHeaderKey = process.env.REFRESH_HEADER_KEY

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({ storage: FileSystemStoredFile })
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
        const { access_token, new_refresh_token, payload } = await this.authService.signIn(signInDto, req, res, this.cookieOptions);

        res.cookie('refresh_token', new_refresh_token, this.cookieOptions);
        res.set(this.refreshHeaderKey, `${new_refresh_token}`);

        return { access_token, refreshToken: new_refresh_token, payload };
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(TransactionInterceptor)
    @UseGuards(RefreshTokenGuard)
    @FormDataRequest({ storage: FileSystemStoredFile })
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refresh_token = req.cookies?.refresh_token;
        if (!refresh_token) throw new UnauthorizedException();

        const { new_access_token, new_refresh_token, payload } = await this.authService.refresh(refresh_token, res, this.cookieOptions, this.refreshHeaderKey);

        res.cookie('refresh_token', new_refresh_token, this.cookieOptions);
        res.set(this.refreshHeaderKey, `${new_refresh_token}`);

        return { access_token: new_access_token, refresh_token: new_refresh_token, payload };
    }

    @Public()
    @Post('register')
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({ storage: FileSystemStoredFile })
    @UseInterceptors(TransactionInterceptor)
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }

    @Public()
    @Post('verifyEmail')
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({ storage: FileSystemStoredFile })
    @UseInterceptors(TransactionInterceptor)
    async verifyEmail(@Body() emailVerificationDto: EmailVerificationDto) {
        return await this.authService.verifyEmail(emailVerificationDto);
    }

    @Public()
    @Post('logout')
    @UseInterceptors(TransactionInterceptor)
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        // on client also delete the access_token

        const refresh_token = req.cookies?.refresh_token;
        if (!refresh_token) return res.sendStatus(204)

        await this.authService.logout(refresh_token);

        res.clearCookie('refresh_token', this.cookieOptions);
        res.removeHeader(this.refreshHeaderKey);
        return;
    }

    @Public()
    @Post('forgetPassword')
    @HttpCode(HttpStatus.OK)
    // @Throttle({ default: { limit: 1, ttl: 5000 } }) // override the default rate limit for password reset
    forgetPassword(@Body() { email }: PasswordChangeRequestDto) {
        return this.authService.forgetPassword(email)
    }

    @Public()
    @Post('resetPassword')
    @HttpCode(HttpStatus.OK)
    // @Throttle({ default: { limit: 1, ttl: 5000 } }) // override the default rate limit for password reset
    resetPassword(@Body() { password, confirmPassword, token }: ResetPasswordDto) {
        if (password !== confirmPassword) throw new BadRequestException('Passwords do not match');

        return this.authService.resetPassword(password, token);
    }
}
