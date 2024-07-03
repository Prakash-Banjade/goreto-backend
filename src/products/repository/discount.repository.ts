import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Sku } from '../skus/entities/sku.entity';

@Injectable({ scope: Scope.REQUEST })
export class DiscountRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveSku(sku: Sku) {
        return await this.getRepository<Sku>(Sku).save(sku);
    }
}