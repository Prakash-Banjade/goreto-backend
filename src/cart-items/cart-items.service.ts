import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Brackets, IsNull, Not, Or, Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { CartsService } from 'src/carts/carts.service';
import { Deleted, QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem) private readonly cartItemsRepo: Repository<CartItem>,
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
  ) { }

  async create(createCartItemDto: CreateCartItemDto) {
    const cart = await this.cartsService.findOne(createCartItemDto.cartId);
    const product = await this.productsService.findOne(createCartItemDto.productId);

    const cartItem = this.cartItemsRepo.create({
      cart,
      product,
      quantity: createCartItemDto.quantity
    });

    return await this.cartItemsRepo.save(cartItem);
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.cartItemsRepo.createQueryBuilder('cartItem');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("cartItem.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoinAndSelect("cartItem.category", "category")
      .leftJoinAndSelect("cartItem.discount", "discount")
      .leftJoinAndSelect("cartItem.cutType", "cutType")
      .leftJoinAndSelect("cartItem.preparation", "preparation")
      .andWhere(new Brackets(qb => {
        // qb.where([
        //   { productName: ILike(`%${queryDto.search ?? ''}%`) },
        // ]);
        // queryDto.gender && qb.andWhere({ gender: queryDto.gender });

      }))
      .andWhere(new Brackets(qb => {
        // if (queryDto.country) qb.andWhere("LOWER(address.country) LIKE LOWER(:country)", { country: `%${queryDto.country ?? ''}%` });
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existing = await this.cartItemsRepo.findOne({
      where: { id }
    })
    if (!existing) throw new BadRequestException('Cart item not found');

    return existing
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto) {
    const existing = await this.findOne(id);

    const cart = updateCartItemDto.cartId ? await this.cartsService.findOne(updateCartItemDto.cartId) : existing.cart
    const product = updateCartItemDto.productId ? await this.productsService.findOne(updateCartItemDto.productId) : existing.product

    Object.assign(existing, {
      ...updateCartItemDto,
      cart,
      product
    })

    return await this.cartItemsRepo.save(existing);
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    await this.cartItemsRepo.softRemove(existing);

    return {
      message: 'Cart item removed',
    }
  }
}
