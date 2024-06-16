import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
  ],
  providers: [AddressesService],
})
export class AddressesModule { }
