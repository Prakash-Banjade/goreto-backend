import { Injectable } from '@nestjs/common';
import { Brackets, IsNull, Not, Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
import { ProductsService } from './products.service';
import { Deleted, QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class DiscountsService {
    constructor(
        @InjectRepository(Discount) private readonly discountsRepo: Repository<Discount>,
        private readonly productService: ProductsService
    ) { }

    async create(createDiscountDto: CreateDiscountDto) {
        const product = await this.productService.findOne(createDiscountDto.productId);

        const newDiscountType = this.discountsRepo.create({
            ...createDiscountDto,
            product,
        });
        return await this.discountsRepo.save(newDiscountType);
    }

    async findAll(queryDto: QueryDto) {
        const queryBuilder = this.discountsRepo.createQueryBuilder('product');
        const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

        queryBuilder
            .orderBy("product.createdAt", queryDto.order)
            .skip(queryDto.search ? undefined : queryDto.skip)
            .take(queryDto.search ? undefined : queryDto.take)
            .withDeleted()
            .where({ deletedAt })
            .andWhere(new Brackets(qb => {
                // qb.where([
                //     { productName: ILike(`%${queryDto.search ?? ''}%`) },
                // ]);
                // queryDto.gender && qb.andWhere({ gender: queryDto.gender });

            }))
            .andWhere(new Brackets(qb => {
                // if (queryDto.country) qb.andWhere("LOWER(address.country) LIKE LOWER(:country)", { country: `%${queryDto.country ?? ''}%` });
            }))

        return paginatedData(queryDto, queryBuilder);
    }

    async findOne(id: string) {
        const existingDiscountType = await this.discountsRepo.findOneBy({ id });
        if (!existingDiscountType) throw new Error('Discount type not found');

        return existingDiscountType;
    }

    async update(id: string, updateDiscountDto: UpdateDiscountDto) {
        const existingDiscountType = await this.findOne(id);
        const product = updateDiscountDto.productId ? await this.productService.findOne(updateDiscountDto.productId) : existingDiscountType.product;

        Object.assign(existingDiscountType, {
            ...updateDiscountDto,
            product,
        });
        return await this.discountsRepo.save(existingDiscountType);
    }

    async remove(id: string) {
        const existingDiscountType = await this.findOne(id);

        return await this.discountsRepo.remove(existingDiscountType);
    }
}
