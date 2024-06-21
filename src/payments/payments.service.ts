import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly paymentsRepo: Repository<Payment>,
  ) { }

  async create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
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

  async remove(id: string) {
    return `This action removes a #${id} payment`;
  }
}
