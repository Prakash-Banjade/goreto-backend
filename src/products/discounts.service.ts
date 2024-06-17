import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
import { ProductsService } from './products.service';

@Injectable()
export class DiscountsService {
    constructor(
        @InjectRepository(Discount) private readonly discountTypesRepo: Repository<Discount>,
        private readonly productService: ProductsService
    ) { }

    async create(createDiscountDto: CreateDiscountDto) {
        const product = await this.productService.findOne(createDiscountDto.productId);

        const newDiscountType = this.discountTypesRepo.create({
            ...createDiscountDto,
            product,
        });
        return await this.discountTypesRepo.save(newDiscountType);
    }

    async findAll() {
        return await this.discountTypesRepo.find();
    }

    async findOne(id: string) {
        const existingDiscountType = await this.discountTypesRepo.findOneBy({ id });
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
        return await this.discountTypesRepo.save(existingDiscountType);
    }

    async remove(id: string) {
        const existingDiscountType = await this.findOne(id);

        return await this.discountTypesRepo.remove(existingDiscountType);
    }
}
