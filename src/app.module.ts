require('dotenv').config();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/db.config';
import { UsersModule } from './users/users.module';
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { AbilitiesGuard } from './casl/guards/abilities.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AddressesModule } from './addresses/addresses.module';
import { AccountsModule } from './accounts/accounts.module';
import { ShippingAddressesModule } from './shipping-addresses/shipping-addresses.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CartsModule } from './carts/carts.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { StripeModule } from './stripe/stripe.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { AppSettingsModule } from './app-settings/app-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(configService),
    NestjsFormDataModule.config({
      storage: FileSystemStoredFile,
      isGlobal: true,
      fileSystemStoragePath: 'public',
      autoDeleteFile: false,
      cleanupAfterSuccessHandle: false, // !important
    }),
    StripeModule.forRootAsync(),
    // ThrottlerModule.forRoot([{
    //   ttl: 2000, // 1 requests per 2s
    //   limit: 1,
    // }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // serve static files eg: localhost:3000/filename.png
    }),
    // CacheModule.register({
    //   ttl: 5, // seconds
    //   max: 10, // maximum number of items in cache
    //   // @ts-ignore
    //   store: async () => await redisStore({
    //     // Store-specific configuration:
    //     socket: {
    //       host: process.env.REDIS_HOST,
    //       port: +process.env.REDIS_PORT,
    //     }
    //   })
    // }),
    UsersModule,
    AuthModule,
    CaslModule,
    AddressesModule,
    AccountsModule,
    ShippingAddressesModule,
    ProductsModule,
    CategoriesModule,
    CartsModule,
    CartItemsModule,
    ReviewsModule,
    OrdersModule,
    PaymentsModule,
    MailModule,
    AppSettingsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // global auth guard
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard, // global ability guard
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard, // global rate limiting, but can be overriden in route level
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor, // global caching, only get requests will be cached
    // },
  ],
})
export class AppModule { }
