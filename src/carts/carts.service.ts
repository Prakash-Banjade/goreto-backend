import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Brackets, IsNull, Not, Or, Repository } from 'typeorm';
import { CartsRepository } from './repository/carts.repository';
import { UsersService } from 'src/users/users.service';
import { Deleted, QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    private readonly cartRepository: CartsRepository,
    private readonly usersService: UsersService
  ) { }

  async create(createCartDto: CreateCartDto) {
    const user = await this.usersService.findOne(createCartDto.userId);

    const cart = this.cartRepo.create({
      user
    });

    return await this.cartRepository.createCart(cart);
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.cartRepo.createQueryBuilder('cart');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("cart.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoinAndSelect("cart.category", "category")
      .leftJoinAndSelect("cart.discount", "discount")
      .leftJoinAndSelect("cart.cutType", "cutType")
      .leftJoinAndSelect("cart.preparation", "preparation")
      .andWhere(new Brackets(qb => {
        // qb.where([
        //   { cartName: ILike(`%${queryDto.search ?? ''}%`) },
        // ]);
        // queryDto.gender && qb.andWhere({ gender: queryDto.gender });

      }))
      .andWhere(new Brackets(qb => {
        // if (queryDto.country) qb.andWhere("LOWER(address.country) LIKE LOWER(:country)", { country: `%${queryDto.country ?? ''}%` });
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existing = await this.cartRepo.findOne({
      where: { id }
    })
    if (!existing) throw new BadRequestException('Cart not found');

    return existing
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    return updateCartDto
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    await this.cartRepo.softRemove(existing);

    return {
      message: 'Cart removed',
    }
  }
}
