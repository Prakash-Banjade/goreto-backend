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

  async findAll(currentUser: AuthUser) {
    return await this.shippingAddressRepo.find({
      where: { user: { id: currentUser.userId } },
      relations: { address: true },
    });
  }

  async findOne(id: string, currentUser: AuthUser) {
    const existingAddress = await this.shippingAddressRepo.findOne({
      where: { id, user: { id: currentUser.userId } },
      relations: { address: true, user: true },
    });
    if (!existingAddress) throw new Error('Address not found');

    return existingAddress;
  }

  async getDefaultShippingAddress(currentUser: AuthUser) {
    const defaultShippingAddress = await this.shippingAddressRepo.findOne({
      where: { user: { id: currentUser.userId }, default: true },
    })

    return defaultShippingAddress;
  }

  async update(id: string, updateShippingAddressDto: UpdateShippingAddressDto, currentUser: AuthUser) {
    const existingShippingAddress = await this.findOne(id, currentUser);

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

  async remove(id: string, currentUser: AuthUser) {
    const existingShippingAddress = await this.findOne(id, currentUser);
    return await this.shippingAddressRepo.remove(existingShippingAddress);
  }
}
