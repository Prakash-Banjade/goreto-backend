import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { TransactionInterceptor } from 'src/core/interceptors/transaction.interceptor';
import { Action, AuthUser } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { QueryDto } from 'src/core/dto/query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/core/decorators/currentuser.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  // <-- CART IS CREATE ON USER REGISTRATION -->
  // @Post()
  // @UseInterceptors(TransactionInterceptor)
  // @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  // async create(@Body() createCartDto: CreateCartDto) {
  //   return await this.cartsService.create(createCartDto);
  // }

  @Get()
  @ApiPaginatedResponse(CreateCartDto)
  async findMyCart(@Query('selected') selected: string, @CurrentUser() currentUser: AuthUser) {
    return await this.cartsService.findMyCart(currentUser, selected === 'true');
  }

  // CART DOESN'T NEED TO BE UPDATE OR DELETED. IT'S ONLY USED TO ADD ITEMS TO THE CART
  // CART IS AUTOMATICALLY DELETED WHEN THE USER IS DELETED

  // @Patch(':id')
  // @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartsService.update(id, updateCartDto);
  // }

  // @Delete(':id')
  // @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  // remove(@Param('id') id: string) {
  //   return this.cartsService.remove(id);
  // }
}
