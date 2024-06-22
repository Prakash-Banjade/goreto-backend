import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@Injectable({ scope: Scope.REQUEST })
export class PaymentsRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async savePayment(payment: Payment) {
        return await this.getRepository<Payment>(Payment).save(payment);
    }
}