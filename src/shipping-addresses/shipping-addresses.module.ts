import { Module } from '@nestjs/common';
import { ShippingAddressesService } from './shipping-addresses.service';
import { ShippingAddressesController } from './shipping-addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShippingAddress]),
    UsersModule,
  ],
  controllers: [ShippingAddressesController],
  providers: [ShippingAddressesService],
})
export class ShippingAddressesModule { }
