import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { QueryDto } from 'src/core/dto/query.dto';
import { Action, AuthUser } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/core/decorators/currentuser.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Cart Items')
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) { }

  @Post()
  @ChekcAbilities({ action: Action.CREATE, subject: User })
  create(@Body() createCartItemDto: CreateCartItemDto, @CurrentUser() currentUser: AuthUser) {
    return this.cartItemsService.create(createCartItemDto, currentUser);
  }

  @Get()
  @ApiPaginatedResponse(CreateCartItemDto)
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll(@Query() queryDto: QueryDto) {
    return this.cartItemsService.findAll(queryDto);
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id') id: string) {
    return this.cartItemsService.findOne(id);
  }

  @Patch(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: User })
  update(@Param('id') id: string, @Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartItemsService.update(id, updateCartItemDto);
  }

  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('id') id: string) {
    return this.cartItemsService.remove(id);
  }
}
