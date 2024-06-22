import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CanceledOrder } from '../entities/canceled-order.entity';

@Injectable({ scope: Scope.REQUEST })
export class OrdersRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveOrder(order: Order) {
        return await this.getRepository<Order>(Order).save(order);
    }

    async cancelOrder(canceledOrder: CanceledOrder) {
        return await this.getRepository<CanceledOrder>(CanceledOrder).save(canceledOrder);
    }
}