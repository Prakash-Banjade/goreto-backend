import { Injectable } from '@nestjs/common';
import { Brackets, IsNull, Not, Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
import { Deleted, QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { SkusService } from './skus/skus.service';
import { Sku } from './skus/entities/sku.entity';
import { DiscountRepository } from './repository/discount.repository';

@Injectable()
export class DiscountsService {
    constructor(
        @InjectRepository(Discount) private readonly discountsRepo: Repository<Discount>,
        @InjectRepository(Sku) private readonly skuRepo: Repository<Sku>,
        private readonly skuService: SkusService,
        private readonly discountRepository: DiscountRepository,
    ) { }

    async create(createDiscountDto: CreateDiscountDto) {
        const sku = await this.skuService.findOne(createDiscountDto.skuId);

        const newDiscountType = this.discountsRepo.create({
            ...createDiscountDto,
            sku,
        });

        sku.currentPrice = sku.price * (1 - createDiscountDto.discountPercentage / 100);
        await this.discountRepository.saveSku(sku);

        return await this.discountRepository.saveDiscount(newDiscountType);
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
        const existingDiscountType = await this.discountsRepo.findOne({ where: { id }, relations: { sku: true } });
        if (!existingDiscountType) throw new Error('Discount type not found');

        return existingDiscountType;
    }

    async update(id: string, updateDiscountDto: UpdateDiscountDto) {
        const existingDiscountType = await this.findOne(id);
        const sku = updateDiscountDto.skuId ? await this.skuService.findOne(updateDiscountDto.skuId) : existingDiscountType.sku;

        if (updateDiscountDto.discountPercentage && updateDiscountDto.discountPercentage !== existingDiscountType.discountPercentage) {
            sku.currentPrice = sku.price * (1 - updateDiscountDto.discountPercentage / 100);
            await this.discountRepository.saveSku(sku);
        }

        Object.assign(existingDiscountType, {
            ...updateDiscountDto,
            sku,
        });

        return await this.discountRepository.saveDiscount(existingDiscountType);
    }

    async remove(id: string) {
        const existingDiscountType = await this.findOne(id);

        return await this.discountsRepo.remove(existingDiscountType);
    }
}
