import { Injectable } from '@nestjs/common';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { Repository } from 'typeorm';
import { AddressesService } from 'src/addresses/addresses.service';
import { UsersService } from 'src/users/users.service';
import { extractAddressDto } from 'src/core/utils/extractAddressDto';
import { AuthUser } from 'src/core/types/global.types';

@Injectable()
export class ShippingAddressesService {
  constructor(
    @InjectRepository(ShippingAddress) private readonly shippingAddressRepo: Repository<ShippingAddress>,
    private readonly addressService: AddressesService,
    private readonly usersService: UsersService,
  ) { }

  async create(createShippingAddressDto: CreateShippingAddressDto, currentUser: AuthUser) {
    const user = await this.usersService.findOne(currentUser.userId);

    // create new address
    const address = await this.addressService.create(extractAddressDto<CreateShippingAddressDto>(createShippingAddressDto));

    // update default shipping address if this is choosen as default
    if (createShippingAddressDto.default) {
      await this.shippingAddressRepo.update({ user, default: true }, { default: false });
    }

    // create new shipping address
    const shippingAddress = this.shippingAddressRepo.create({
      user,
      address,
    });

    return this.shippingAddressRepo.save(shippingAddress);
  }

  async findAll() {
    return await this.shippingAddressRepo.find();
  }

  async findOne(id: string) {
    const existingAddress = await this.shippingAddressRepo.findOne({
      where: { id },
      relations: { address: true, user: true },
    });
    if (!existingAddress) throw new Error('Address not found');

    return existingAddress;
  }

  async update(id: string, updateShippingAddressDto: UpdateShippingAddressDto) {
    const existingShippingAddress = await this.findOne(id);

    // update address
    const address = await this.addressService.update(existingShippingAddress.address?.id, updateShippingAddressDto);

    existingShippingAddress.address = address;

    // update default shipping address if this is choosen as default
    if (updateShippingAddressDto?.default) {
      await this.shippingAddressRepo.update({ user: existingShippingAddress.user, default: true }, { default: false });
      existingShippingAddress.default = true;
    }

    return await this.shippingAddressRepo.save(existingShippingAddress);
  }

  async remove(id: string) {
    const existingShippingAddress = await this.findOne(id);
    return await this.shippingAddressRepo.remove(existingShippingAddress);
  }
}
