import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Cart } from '../entities/cart.entity';

@Injectable({ scope: Scope.REQUEST })
export class CartsRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async createCart(cart: Cart) {
        return await this.getRepository(Cart).save(cart);
    }
}