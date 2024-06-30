import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable({ scope: Scope.REQUEST })
export class ReviewsRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveReview(review: Review) {
        return await this.getRepository<Review>(Review).save(review);
    }

    async saveProduct(product: Product) {
        return await this.getRepository<Product>(Product).save(product);
    }
}