import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Account } from 'src/accounts/entities/account.entity';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    async sendEmailVerificationOtp(account: Account, otp: number) {
        const result = await this.mailerService.sendMail({
            to: account.email,
            subject: 'Email verification',
            template: './sendEmailVerificationOtp', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: account.firstName + ' ' + account.lastName,
                otp: otp
            },
        });

        const previewUrl = nodemailer.getTestMessageUrl(result);
        console.log('Preview URL:', previewUrl);

        return { result, previewUrl };

    }

    async sendResetPasswordLink(account: Account, resetToken: string) {
        const result = await this.mailerService.sendMail({
            to: account.email,
            subject: 'Reset your password',
            template: './sendResetPasswordLink', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: account.firstName + ' ' + account.lastName,
                resetLink: `${this.configService.get('CLIENT_URL')}/reset-password/${resetToken}`,
            },
        });

        const previewUrl = nodemailer.getTestMessageUrl(result);
        console.log('Preview URL:', previewUrl);

        return { result, previewUrl };
    }
}