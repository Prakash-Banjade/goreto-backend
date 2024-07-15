import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Brackets, Repository } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { AuthUser, PaymentMethod, PaymentStatus, ReportPeriod } from 'src/core/types/global.types';
import { PaymentsRepository } from './repository/payment.repository';
import { StripeService } from 'src/stripe/stripe.service';
import { CONSTANTS } from 'src/core/CONSTANTS';
import paginatedData from 'src/core/utils/paginatedData';
import { PaymentQueryDto } from './dto/payment-query.dto';

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
          status: PaymentStatus.COMPLETED
        })

        await this.paymentsRepository.savePayment(payment); // transaction

        return {
          message: `Be ready with amount ${CONSTANTS.defaultProductPriceUnit} ${order.totalAmount} on delivery. Thank you.`,
        }
      }

      case PaymentMethod.CASH_ON_DELIVERY: {
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
          message: 'Please confirm payment',
          client_secret: paymentIntent.client_secret
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

  async findAll(queryDto: PaymentQueryDto) {
    const queryBuilder = this.paymentsRepo.createQueryBuilder('payment');

    let startDate = new Date().toISOString(), endDate = new Date().toISOString();

    switch (queryDto.period) {
      case ReportPeriod.DAY:
        startDate = new Date().toISOString()
        endDate = new Date().toISOString()
        break
      case ReportPeriod.WEEK:
        startDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
        endDate = new Date().toISOString()
        break
      case ReportPeriod.MONTH:
        startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
        endDate = new Date().toISOString()
        break
      case ReportPeriod.YEAR:
        startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()
        console.log(startDate)
        endDate = new Date().toISOString()
        break
    }

    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

    queryBuilder
      .orderBy("payment.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .leftJoin('payment.order', 'order')
      .where(new Brackets(qb => {
        queryDto.trackingNumber && qb.andWhere("order.trackingNumber = :trackingNumber", { trackingNumber: queryDto.trackingNumber })
        queryDto.period && qb.andWhere("payment.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate: adjustedEndDate })
        queryDto.dateFrom && qb.andWhere("payment.createdAt >= :dateFrom", { dateFrom: queryDto.dateFrom })
        queryDto.dateTo && qb.andWhere("payment.createdAt <= :dateTo", { dateTo: queryDto.dateTo })
      }))
      .select([
        'payment.id',
        'order.id',
        'payment.createdAt',
        'order.totalAmount',
        'payment.status',
        'payment.paymentDate',
        'payment.paymentMethod',
        'order.trackingNumber'
      ])

    return paginatedData(queryDto, queryBuilder);
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
