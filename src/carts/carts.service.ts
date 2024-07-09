import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartsRepository } from './repository/carts.repository';
import { UsersService } from 'src/users/users.service';
import { AuthUser } from 'src/core/types/global.types';

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

  async findMyCart(currentUser: AuthUser) {
    const existing = await this.cartRepo.findOne({
      where: { user: { id: currentUser.userId } },
      relations: {
        cartItems: {
          sku: {
            product: true
          },
        }
      },
    })
    if (!existing) throw new BadRequestException('Cart not found');


    return existing
  }
}
