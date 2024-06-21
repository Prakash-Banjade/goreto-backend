import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { QueryDto } from 'src/core/dto/query.dto';
import { Action, AuthUser } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/core/decorators/currentuser.decorator';
import { User } from 'src/users/entities/user.entity';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@ApiBearerAuth()
@ApiTags('Cart Items')
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) { }

  @Post()
  @ChekcAbilities({ action: Action.CREATE, subject: User })
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createCartItemDto: CreateCartItemDto, @CurrentUser() currentUser: AuthUser) {
    return this.cartItemsService.create(createCartItemDto, currentUser);
  }

  @Get()
  @ApiPaginatedResponse(CreateCartItemDto)
  @ChekcAbilities({ action: Action.READ, subject: 'all' }) // User can't read all cart items, only their own, their all cart items can be retrieved from their cart from route `/cart/my-cart`
  findAll(@Query() queryDto: QueryDto) {
    return this.cartItemsService.findAll(queryDto);
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: User }) // User read their own cart item
  findOne(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.cartItemsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: User }) // User update their own cart item
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(@Param('id') id: string, @Body() updateCartItemDto: UpdateCartItemDto, @CurrentUser() currentUser: AuthUser) {
    return this.cartItemsService.update(id, updateCartItemDto, currentUser);
  }

  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: User }) // User can remove any cart item from their cart
  remove(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.cartItemsService.remove(id, currentUser);
  }
}
