import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Brackets, IsNull, Not, Or, Repository } from 'typeorm';
import { OrderQueryDto } from './dto/order-query.dto';
import { AuthUser, OrderStatus, PaymentMethod, Roles } from 'src/core/types/global.types';
import { UsersService } from 'src/users/users.service';
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
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CanceledOrder } from './entities/canceled-order.entity';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    private readonly ordersRepository: OrdersRepository,
    @InjectRepository(OrderItem) private readonly orderItemsRepo: Repository<OrderItem>,
    private readonly orderItemsRepository: OrderItemsRepository,
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    private readonly productsRepository: ProductsRepository,
    private readonly paymentService: PaymentsService,
    @InjectRepository(CanceledOrder) private readonly canceledOrdersRepo: Repository<CanceledOrder>,
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
      const foundShippingAddress = await this.shippingAddressesService.findOne(shippingAddressId, currentUser);
      if (!foundShippingAddress || foundShippingAddress.user.id !== user.id) throw new NotFoundException('Shipping address not found');
      shippingAddress = foundShippingAddress;
    }

    // validate cart-items & calculate total amount
    let totalAmount: number = 0;
    for (const cartItemId of cartItemIds) {
      const cartItem = cart.cartItems.find(item => item.id === cartItemId);
      if (!cartItem) throw new NotFoundException('Cart item not found');

      const product = cartItem.product;
      if (!product) throw new BadRequestException(`Not available: ${product.productName}`);
      if (product.stockQuantity < cartItem.quantity) throw new BadRequestException(`Insufficient stock: ${product.productName} \n In Stock: ${product.stockQuantity} \n Requested: ${cartItem.quantity}`);

      totalAmount += cartItem.price;
    }


    // create order
    console.log('1')
    const order = this.ordersRepo.create({
      user,
      shippingAddress,
      totalAmount,
    })

    const savedOrder = await this.ordersRepository.saveOrder(order); // transaction
    console.log('2')

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

    // TODO: REMOVE CART-ITEMS AFTER ORDER IS CREATED ??

    // PROCESS PAYMENT
    const paymentResult = await this.paymentService.create(savedOrder, createOrderDto.paymentMethod);

    return {
      message: paymentResult.message,
    };
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
      .leftJoinAndSelect("order.payment", "payment")
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
      where: { id, user: { id: userId } },
      relations: {
        orderItems: {
          product: true,
        }
      }
    })
    if (!existing) throw new NotFoundException('Order not found')

    return existing;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const existing = await this.ordersRepo.findOne({
      where: { id },
    })
    if (!existing) throw new NotFoundException('Order not found')

    if (existing.status === OrderStatus.DELIVERED || existing.status === OrderStatus.CANCELLED) throw new BadRequestException('Order already delivered')

    existing.status = updateOrderDto.status;

    await this.ordersRepository.saveOrder(existing); // transaction

    // TODO: NOTIFY CUSTOMER BY SENDING EMAIL ABOUT THE ORDER STATUS

    return {
      message: 'Order updated',
    }
  }

  async cancelOrder(id: string, cancelOrderDto: CancelOrderDto, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);
    if (!existing) throw new NotFoundException('Order not found')

    if ((existing.status !== OrderStatus.PENDING) && (existing.status !== OrderStatus.PROCESSING)) throw new BadRequestException('Order cannot be cancelled now.')

    // INCREASE THE PRODUCT STOCK
    for (const orderItem of existing.orderItems) {
      const product = orderItem.product;
      if (!product) throw new BadRequestException(`Not available: ${product.productName}`);
      product.stockQuantity += orderItem.quantity;
      await this.productsRepository.saveProduct(product);
    }

    // CREATE CANCELED ORDER
    existing.status = OrderStatus.CANCELLED;

    await this.ordersRepository.saveOrder(existing); // transaction

    const canceledOrder = this.canceledOrdersRepo.create({
      order: existing,
      reason: cancelOrderDto.reason,
      description: cancelOrderDto?.description
    })
    await this.ordersRepository.cancelOrder(canceledOrder);

    return {
      message: "Order cancelled",
    }
  }

}
