import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShippingAddressesService } from './shipping-addresses.service';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { Action, AuthUser } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/core/decorators/currentuser.decorator';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Shipping Addresses')
@Controller('shipping-addresses')
export class ShippingAddressesController {
  constructor(private readonly shippingAddressesService: ShippingAddressesService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createShippingAddressDto: CreateShippingAddressDto, @CurrentUser() currentUser: AuthUser) {
    return this.shippingAddressesService.create(createShippingAddressDto, currentUser);
  }

  @Get()
  @ChekcAbilities({ action: Action.READ, subject: User })
  findAll(@CurrentUser() currentUser: AuthUser) {
    return this.shippingAddressesService.findAll(currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.shippingAddressesService.findOne(id, currentUser);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(@Param('id') id: string, @Body() updateShippingAddressDto: UpdateShippingAddressDto, @CurrentUser() currentUser: AuthUser) {
    return this.shippingAddressesService.update(id, updateShippingAddressDto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.shippingAddressesService.remove(id, currentUser);
  }
}
