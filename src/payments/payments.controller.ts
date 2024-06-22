import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Action, AuthUser } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { TransactionInterceptor } from 'src/core/interceptors/transaction.interceptor';
import { CurrentUser } from 'src/core/decorators/currentuser.decorator';

@ApiBearerAuth()
@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  // @Get()
  // findAll() {
  //   return this.paymentsService.findAll();
  // }

  @Get(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post('confirm')
  @UseInterceptors(TransactionInterceptor)
  @ChekcAbilities({ action: Action.UPDATE, subject: User })
  async create(@Body('paymentIndentId') paymentIndentId: string, @CurrentUser() currentUser: AuthUser) {
    return this.paymentsService.confirmPayment(paymentIndentId, currentUser);
  }

  @Patch(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.paymentsService.remove(id);
  // }
}
