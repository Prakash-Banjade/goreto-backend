import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Account } from 'src/accounts/entities/account.entity';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    async sendEmailVerificationOtp(account: Account, otp: number, verificationToken: string) {
        const result = await this.mailerService.sendMail({
            to: account.email,
            subject: 'Email verification',
            template: './sendEmailVerificationOtp', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: account.firstName + ' ' + account.lastName,
                otp: otp,
                url: `${this.configService.get('CLIENT_URL')}/verify-email/${verificationToken}`,
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

    async sendOrderConfirmation(account: Account, order: Order, items: CartItem[]) {
        const result = await this.mailerService.sendMail({
            to: account.email,
            subject: `Your Order Confirmation - Order #${order.trackingNumber}`,
            template: './orderConfirmation',
            context: {
                name: account.firstName + ' ' + account.lastName,
                trackingNumber: order.trackingNumber,
                orderDate: new Date(order.orderDate).toDateString(),
                shippingAddress: order.shippingAddress.address.address1,
                items: items?.map(item => ({
                    name: item.sku.product.productName,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: order.totalAmount,
            },
        });

        const previewUrl = nodemailer.getTestMessageUrl(result);
        console.log('Preview URL:', previewUrl);

        return { result, previewUrl };
    }

    async sendOrderCancellationByAdmin(account: Account, order: Order, items: OrderItem[]) {
        const result = await this.mailerService.sendMail({
            to: account.email,
            subject: `Order Cancellation Notice - Order #${order.trackingNumber}`,
            template: './sendOrderCancellationByAdmin',
            context: {
                customerName: account.firstName + ' ' + account.lastName,
                trackingNumber: order.trackingNumber,
                orderDate: new Date(order.orderDate).toDateString(),
                shippingAddress: order.shippingAddress.address.address1,
                items: items?.map(item => ({
                    name: item.sku.product.productName,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: order.totalAmount,
            },
        });

        const previewUrl = nodemailer.getTestMessageUrl(result);
        console.log('Preview URL:', previewUrl);

        return { result, previewUrl };
    }

    async sendOrderCancellationByUser(account: Account, order: Order, items: OrderItem[]) {
        const result = await this.mailerService.sendMail({
            to: account.email,
            subject: `Your order has been cancelled - Order #${order.trackingNumber}`,
            template: './sendOrderCancellationByUser',
            context: {
                customerName: account.firstName + ' ' + account.lastName,
                trackingNumber: order.trackingNumber,
                orderDate: new Date(order.orderDate).toDateString(),
                shippingAddress: order.shippingAddress.address.address1,
                items: items?.map(item => ({
                    name: item.sku.product.productName,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: order.totalAmount,
            },
        });

        const previewUrl = nodemailer.getTestMessageUrl(result);
        console.log('Preview URL:', previewUrl);

        return { result, previewUrl };
    }
}