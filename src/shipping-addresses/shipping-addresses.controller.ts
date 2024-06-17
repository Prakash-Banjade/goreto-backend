import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShippingAddressesService } from './shipping-addresses.service';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { Action, AuthUser } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/core/decorators/currentuser.decorator';

@ApiBearerAuth()
@ApiTags('Shipping Addresses')
@Controller('shipping-addresses')
export class ShippingAddressesController {
  constructor(private readonly shippingAddressesService: ShippingAddressesService) { }

  @Post()
  create(@Body() createShippingAddressDto: CreateShippingAddressDto, @CurrentUser() currentUser: AuthUser) {
    return this.shippingAddressesService.create(createShippingAddressDto, currentUser);
  }

  @Get()
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll() {
    return this.shippingAddressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingAddressesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShippingAddressDto: UpdateShippingAddressDto) {
    return this.shippingAddressesService.update(id, updateShippingAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingAddressesService.remove(id);
  }
}
