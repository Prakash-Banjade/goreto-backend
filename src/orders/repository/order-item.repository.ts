import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';

@Injectable({ scope: Scope.REQUEST })
export class OrderItemsRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async createOrderItem(orderItem: OrderItem) {
        return await this.getRepository<OrderItem>(OrderItem).save(orderItem);
    }
}