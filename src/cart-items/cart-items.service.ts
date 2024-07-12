import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Brackets, IsNull, Not, Or, Repository } from 'typeorm';
import { Deleted, QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { AuthUser } from 'src/core/types/global.types';
import { UsersService } from 'src/users/users.service';
import { CurrentUser } from 'src/core/decorators/currentuser.decorator';
import { SkusService } from 'src/products/skus/skus.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem) private readonly cartItemsRepo: Repository<CartItem>,
    private readonly usersService: UsersService,
    private readonly skusService: SkusService,
  ) { }

  async create(createCartItemDto: CreateCartItemDto, currentUser: AuthUser) {
    const user = await this.usersService.findOne(currentUser.userId)
    const productSku = await this.skusService.findOne(createCartItemDto.skuId);

    // ADD QUANTITY ON EXISTING
    const existingCartItem = await this.cartItemsRepo.findOne({
      where: { cart: { user: { id: currentUser.userId } }, sku: { id: productSku.id } }
    });
    if (existingCartItem) {
      existingCartItem.quantity += createCartItemDto.quantity;
      existingCartItem.sku = productSku; // this is just to calculate price in cart-item.entity
      return await this.cartItemsRepo.save(existingCartItem);
    }

    // CREATE NEW
    const cartItem = this.cartItemsRepo.create({
      cart: user.cart,
      sku: productSku,
      quantity: createCartItemDto.quantity,
      selected: true
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

  async findOne(id: string, currentUser: AuthUser) {
    const existing = await this.cartItemsRepo.findOne({
      where: { id, cart: { user: { id: currentUser.userId } } },
      relations: { sku: true },
    })
    if (!existing) throw new BadRequestException('Cart item not found');

    return existing
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto, @CurrentUser() currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);
    const productPrice = existing?.price / (existing?.quantity ?? 1);

    /**
    |--------------------------------------------------
    | PRODUCT IS NOT UPDATED IN CART ITEM UPDATE
    |--------------------------------------------------
    */

    Object.assign(existing, {
      quantity: updateCartItemDto?.quantity ?? existing.quantity,
      price: productPrice * (updateCartItemDto?.quantity ?? existing.quantity)
    })

    return await this.cartItemsRepo.save(existing);
  }

  async remove(id: string, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);

    await this.cartItemsRepo.softRemove(existing);

    return {
      message: 'Cart item removed',
    }
  }
}
