import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProductsRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveProduct(product: Product) {
        return await this.getRepository<Product>(Product).save(product);
    }
}