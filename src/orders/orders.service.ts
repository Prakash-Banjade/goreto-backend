import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Brackets, ILike, IsNull, Not, Or, Repository } from 'typeorm';
import { OrderQueryDto } from './dto/order-query.dto';
import { AuthUser, PaymentMethod, Roles } from 'src/core/types/global.types';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { CartsService } from 'src/carts/carts.service';
import { ShippingAddressesService } from 'src/shipping-addresses/shipping-addresses.service';
import { Product } from 'src/products/entities/product.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { OrdersRepository } from './repository/order.repository';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemsRepository } from './repository/order-item.repository';
import { ProductsRepository } from 'src/products/repository/product.repository';
import { PaymentsRepository } from 'src/payments/repository/payment.repository';
import { Deleted } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    private readonly ordersRepository: OrdersRepository,
    @InjectRepository(OrderItem) private readonly orderItemsRepo: Repository<OrderItem>,
    private readonly orderItemsRepository: OrderItemsRepository,
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    private readonly productsRepository: ProductsRepository,
    @InjectRepository(Payment) private readonly paymentsRepo: Repository<Payment>,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly usersService: UsersService,
    private readonly cartsService: CartsService,
    private readonly shippingAddressesService: ShippingAddressesService,
  ) { }

  async create(createOrderDto: CreateOrderDto, currentUser: AuthUser) {
    const user = await this.usersService.findOne(currentUser.userId);
    const { shippingAddressId, cartItemIds } = createOrderDto;


    // ensure cart
    const cart = await this.cartsService.getMyCart(currentUser);
    if (!cart) throw new NotFoundException('Cart not found');


    // get shipping address
    const defaultShippingAddress = await this.shippingAddressesService.getDefaultShippingAddress(currentUser);
    if (!defaultShippingAddress && !shippingAddressId) throw new NotFoundException('The user has no default shipping address. Provide a shipping address or set one as default');

    let shippingAddress = defaultShippingAddress;
    if (shippingAddressId) {
      const foundShippingAddress = await this.shippingAddressesService.findOne(shippingAddressId);
      if (!foundShippingAddress || foundShippingAddress.user.id !== user.id) throw new NotFoundException('Shipping address not found');
      shippingAddress = foundShippingAddress;
    }

    // validate cart-items
    for (const cartItemId of cartItemIds) {
      const cartItem = cart.cartItems.find(item => item.id === cartItemId);
      if (!cartItem) throw new NotFoundException('Cart item not found');

      const product = cartItem.product;
      if (!product || product.stockQuantity < cartItem.quantity) {
        throw new BadRequestException('Product not available or insufficient stock');
      }
    }


    // create order
    const order = this.ordersRepo.create({
      user,
      shippingAddress,
    })

    const savedOrder = await this.ordersRepository.saveOrder(order); // transaction

    // create order-items
    for (const cartItem of cart.cartItems) {
      const orderItem = this.orderItemsRepo.create({
        order: savedOrder,
        product: cartItem.product,
        quantity: cartItem.quantity,
      })

      await this.orderItemsRepository.createOrderItem(orderItem); // transaction

      // update product stock
      const product = await this.productsRepo.findOne({
        where: { id: cartItem.product.id },
      });
      product.stockQuantity -= cartItem.quantity;
      await this.productsRepository.saveProduct(product); // transaction
    }

    // process payment
    const payment = this.paymentsRepo.create({
      order: savedOrder,
      paymentMethod: PaymentMethod.CASH,
    })

    await this.paymentsRepository.savePayment(payment); // transaction

    return savedOrder;
  }

  async findAll(queryDto: OrderQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.ordersRepo.createQueryBuilder('order');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("order.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoinAndSelect("order.orderItems", "orderItems")
      .leftJoinAndSelect("orderItems.product", "product")
      .leftJoin("orderItems.product", "product")
      .andWhere(new Brackets(qb => {
        qb.where([
          // { productName: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
        qb.andWhere({ user: { id: currentUser.userId } });
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string, currentUser: AuthUser) {
    const userId = currentUser.role === Roles.ADMIN ? undefined : currentUser.userId

    const existing = await this.ordersRepo.findOne({
      where: { id: userId },
      relations: {
        orderItems: {
          product: true,
        }
      }
    })
    if (!existing) throw new NotFoundException('Order not found')

    return existing;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, currentUser: AuthUser) {
    const order = await this.findOne(id, currentUser);

    order.status = updateOrderDto.status;

    return this.ordersRepository.saveOrder(order); // transaction
  }
}