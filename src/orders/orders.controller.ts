import { Controller, Get, Post, Body, Patch, Param, Query, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { OrderQueryDto } from './dto/order-query.dto';
import { CurrentUser } from 'src/core/decorators/currentuser.decorator';
import { Action, AuthUser } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { TransactionInterceptor } from 'src/core/interceptors/transaction.interceptor';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser: AuthUser) {
    return this.ordersService.create(createOrderDto, currentUser);
  }

  @Get()
  @ApiPaginatedResponse(CreateOrderDto)
  findAll(@Query() queryDto: OrderQueryDto, @CurrentUser() currentUser: AuthUser) {
    return this.ordersService.findAll(queryDto, currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) { // both user and admin can access
    return this.ordersService.findOne(id, currentUser);
  }

  @Patch(':id')
  @UseInterceptors(TransactionInterceptor)
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) { // ONLY STATUS CAN BE CHANGED BY ADMIN
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id')
  @UseInterceptors(TransactionInterceptor)
  @ChekcAbilities({ action: Action.UPDATE, subject: User })
  cancelMyOrder(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.ordersService.cancelOrder(id, currentUser);
  }



  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(id);
  // }
}
