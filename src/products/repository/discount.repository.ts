import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Discount } from '../entities/discount.entity';
import { Sku } from '../skus/entities/sku.entity';

@Injectable({ scope: Scope.REQUEST })
export class DiscountRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveDiscount(discount: Discount) {
        return await this.getRepository<Discount>(Discount).save(discount);
    }

    async saveSku(sku: Sku) {
        return await this.getRepository<Sku>(Sku).save(sku);
    }
}