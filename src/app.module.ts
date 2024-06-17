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

@Module({
  imports: [
    TypeOrmModule.forRoot(configService),
    NestjsFormDataModule.config({
      storage: FileSystemStoredFile,
      isGlobal: true,
      fileSystemStoragePath: 'public',
      autoDeleteFile: false,
      cleanupAfterSuccessHandle: false, // !important
    }),
    ThrottlerModule.forRoot([{
      ttl: 2000, // 1 requests per 2s
      limit: 1,
    }]),
    CacheModule.register({
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
      // @ts-ignore
      store: async () => await redisStore({
        // Store-specific configuration:
        socket: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        }
      })
    }),
    UsersModule,
    AuthModule,
    CaslModule,
    AddressesModule,
    AccountsModule,
    ShippingAddressesModule,
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // global rate limiting, but can be overriden in route level
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor, // global caching, only get requests will be cached
    // },
  ],
})
export class AppModule { }
