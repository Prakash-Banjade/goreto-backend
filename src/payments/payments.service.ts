import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { AuthUser, PaymentMethod, PaymentStatus } from 'src/core/types/global.types';
import { PaymentsRepository } from './repository/payment.repository';
import { StripeService } from 'src/stripe/stripe.service';
import { CONSTANTS } from 'src/core/CONSTANTS';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly paymentsRepo: Repository<Payment>,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly stripeService: StripeService,
  ) { }

  async create(order: Order, paymentMethod: PaymentMethod) {
    switch (paymentMethod) {
      case PaymentMethod.CASH: {
        const payment = this.paymentsRepo.create({
          order: order,
          paymentMethod: paymentMethod,
        })

        await this.paymentsRepository.savePayment(payment); // transaction

        return {
          message: `Be ready with amount ${CONSTANTS.defaultProductPriceUnit} ${order.totalAmount} on delivery. Thank you.`,
        }
      }

      case PaymentMethod.STRIPE: {
        const paymentIntent = await this.stripeService.createPaymentIntent(order.totalAmount, CONSTANTS.defaultProductPriceUnit);

        if (paymentIntent) {
          const payment = this.paymentsRepo.create({
            order: order,
            status: PaymentStatus.AWATING_PAYMENT,
            paymentMethod: paymentMethod,
            paymentIntentId: paymentIntent.id,
          })

          await this.paymentsRepository.savePayment(payment); // transaction
        }

        return {
          message: 'Please confirm payment'
        }
      }
    }
  }

  async confirmPayment(paymentIntentId: string, currentUser: AuthUser) {
    const payment = await this.paymentsRepo.findOne({
      where: { paymentIntentId, order: { user: { id: currentUser.userId } } }
    })
    if (!payment) throw new BadRequestException('Payment not found')

    if (payment.status === PaymentStatus.COMPLETED) throw new BadRequestException('Order is not in a valid state for confirmation')

    if (payment.status === PaymentStatus.FAILED) throw new BadRequestException('Cannot perform confirmation on failed payment.')

    if (payment.status !== PaymentStatus.AWATING_PAYMENT) {
      payment.status = PaymentStatus.FAILED
      await this.paymentsRepository.savePayment(payment)

      return {
        message: 'Failed to confirm payment. Please contact support.'
      }
    }

    await this.stripeService.confirmPayment(paymentIntentId)

    payment.status = PaymentStatus.COMPLETED
    await this.paymentsRepository.savePayment(payment)

    return {
      message: 'Payment confirmed'
    }
  }

  async findAll() {
    return `This action returns all payments`;
  }

  async findOne(id: string) {
    const existing = await this.paymentsRepo.findOne({
      where: { id },
    });
    if (!existing) throw new BadRequestException('Payment not found');
    return existing;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const existing = await this.findOne(id);

    existing.status = updatePaymentDto.status;
    await this.paymentsRepo.save(existing);

    return {
      message: 'Payment updated',
    }
  }
}
