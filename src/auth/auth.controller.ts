import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { CookieOptions, Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { TransactionInterceptor } from 'src/core/interceptors/transaction.interceptor';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({ storage: FileSystemStoredFile })
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
        const { access_token, refresh_token } = await this.authService.signIn(signInDto);

        res.cookie('refresh_token', refresh_token, this.cookieOptions);

        return { access_token };
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({ storage: FileSystemStoredFile })
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refresh_token = req.cookies?.refresh_token;
        if (!refresh_token) throw new UnauthorizedException('No refresh token provided');

        const { new_access_token, new_refresh_token } = await this.authService.refresh(refresh_token);

        res.cookie('refresh_token', new_refresh_token, this.cookieOptions);

        return { access_token: new_access_token };
    }

    @Public()
    @Post('register')
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({ storage: FileSystemStoredFile })
    @UseInterceptors(TransactionInterceptor)
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        // on client also delete the access_token

        const refresh_token = req.cookies?.refresh_token;
        if (!refresh_token) return res.sendStatus(204)

        await this.authService.logout(refresh_token, res, this.cookieOptions);

        res.clearCookie('refresh_token', this.cookieOptions);
        return;
    }
}
