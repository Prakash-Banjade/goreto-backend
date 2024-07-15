import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Brackets, Equal, IsNull, Not, Or, Repository } from 'typeorm';
import { OrderQueryDto } from './dto/order-query.dto';
import { AuthUser, OrderStatus, PaymentStatus, Roles } from 'src/core/types/global.types';
import { UsersService } from 'src/users/users.service';
import { CartsService } from 'src/carts/carts.service';
import { ShippingAddressesService } from 'src/shipping-addresses/shipping-addresses.service';
import { OrdersRepository } from './repository/order.repository';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemsRepository } from './repository/order-item.repository';
import { Deleted } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CanceledOrder } from './entities/canceled-order.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { Sku } from 'src/products/skus/entities/sku.entity';
import { SkuRepository } from 'src/products/skus/repository/sku.repository';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    @InjectRepository(CanceledOrder) private readonly canceledOrderRepo: Repository<CanceledOrder>,
    private readonly ordersRepository: OrdersRepository,
    @InjectRepository(OrderItem) private readonly orderItemsRepo: Repository<OrderItem>,
    private readonly orderItemsRepository: OrderItemsRepository,
    @InjectRepository(Sku) private readonly skuRepo: Repository<Sku>,
    private readonly skuRepository: SkuRepository,
    private readonly paymentService: PaymentsService,
    @InjectRepository(CanceledOrder) private readonly canceledOrdersRepo: Repository<CanceledOrder>,
    private readonly usersService: UsersService,
    private readonly cartsService: CartsService,
    private readonly shippingAddressesService: ShippingAddressesService,
  ) { }

  async create(createOrderDto: CreateOrderDto, currentUser: AuthUser) {
    const user = await this.usersService.findOne(currentUser.userId);
    const { shippingAddressId } = createOrderDto;

    // ensure cart
    const cart = await this.cartsService.findMyCart(currentUser, true);
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
    for (const cartItem of cart.cartItems) {
      const sku = cartItem.sku;
      if (sku.stockQuantity < cartItem.quantity) throw new BadRequestException(`Insufficient stock: ${sku.product.productName} \n In Stock: ${sku.stockQuantity} \n Requested: ${cartItem.quantity}`);
      totalAmount += cartItem.price;
    }

    // create order
    const order = this.ordersRepo.create({
      user,
      shippingAddress,
      totalAmount,
    })

    const savedOrder = await this.ordersRepository.saveOrder(order); // transaction

    // create order-items
    for (const cartItem of cart.cartItems) {
      await this.createSkuProductOrderItem(savedOrder, cartItem);
    }

    // REMOVE CART-ITEMS AFTER ORDER IS CREATED
    await this.ordersRepository.removeCartItems(cart.cartItems);

    // PROCESS PAYMENT
    const paymentResult = await this.paymentService.create(savedOrder, createOrderDto.paymentMethod);

    // TODO: INCREASE PRODUCT SOLD COUNT AFTER SUCCESSFUL PAYMENT

    return paymentResult;
  }

  async createSkuProductOrderItem(order: Order, cartItem: CartItem) {
    const orderItem = this.orderItemsRepo.create({
      order: order,
      sku: cartItem.sku,
      quantity: cartItem.quantity,
    })

    await this.orderItemsRepository.createOrderItem(orderItem); // transaction

    // update product stock
    const productSku = await this.skuRepo.findOne({
      where: { id: cartItem.sku.id },
    });
    productSku.stockQuantity -= cartItem.quantity;
    await this.skuRepository.saveSku(productSku); // transaction
  }


  async findAll(queryDto: OrderQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.ordersRepo.createQueryBuilder('order');

    let startDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), endDate = new Date().toISOString();
    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

    const deletedAtCondition = queryDto.deleted === Deleted.ONLY
      ? 'order.deletedAt IS NOT NULL'
      : queryDto.deleted === Deleted.NONE
        ? 'order.deletedAt IS NULL'
        : '1=1'; // Default condition to match all

    queryBuilder
      .orderBy("order.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where(deletedAtCondition)
      .leftJoin("order.user", "user")
      .leftJoin("user.account", "account")
      .leftJoin("order.shippingAddress", "shippingAddress")
      .leftJoin("shippingAddress.address", "address")
      .leftJoin("order.orderItems", "orderItems")
      .leftJoin("orderItems.sku", "sku")
      .leftJoin("sku.product", "product")
      .leftJoin("order.payment", "payment")
      .andWhere(new Brackets(qb => {
        if (currentUser.role === Roles.USER) {
          qb.andWhere("order.userId = :userId", { userId: currentUser.userId });
          queryDto.trackingNumber && qb.andWhere({ trackingNumber: Equal(queryDto.trackingNumber) });
        }
      }))
      .select([
        'order',
        'user',
        'account.firstName',
        'account.lastName',
        'account.email',
        'shippingAddress.addressName',
        'address.address1',
        'orderItems.quantity',
        'orderItems.price',
        'sku.code',
        'sku.price',
        'sku.salePrice',
        'sku.discountPercentage',
        'sku.stockQuantity',
        'sku.product',
        'product.productName',
        'product.slug',
        'product.featuredImage',
        'payment.paymentMethod',
        'payment.status',
      ])

    if (queryDto.recent === 'true') {
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate: adjustedEndDate })
    }

    return paginatedData(queryDto, queryBuilder);
  }

  async findCancelledOrders(queryDto: OrderQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.canceledOrderRepo.createQueryBuilder('canceledOrder');

    const deletedAtCondition = queryDto.deleted === Deleted.ONLY
      ? 'canceledOrder.deletedAt IS NOT NULL'
      : queryDto.deleted === Deleted.NONE
        ? 'canceledOrder.deletedAt IS NULL'
        : '1=1'; // Default condition to match all

    queryBuilder
      .orderBy("canceledOrder.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where(deletedAtCondition)
      .leftJoin("canceledOrder.order", "order")
      .leftJoin("order.user", "user")
      .leftJoin("user.account", "account")
      .leftJoin("order.shippingAddress", "shippingAddress")
      .leftJoin("shippingAddress.address", "address")
      .leftJoin("order.orderItems", "orderItems")
      .leftJoin("orderItems.sku", "sku")
      .leftJoin("sku.product", "product")
      .leftJoin("order.payment", "payment")
      .andWhere(new Brackets(qb => {
        if (currentUser.role === Roles.USER) {
          qb.andWhere("order.userId = :userId", { userId: currentUser.userId });
          queryDto.trackingNumber && qb.andWhere({ trackingNumber: Equal(queryDto.trackingNumber) });
        }
      }))
      .select([
        'canceledOrder',
        'order',
        'user',
        'account.firstName',
        'account.lastName',
        'account.email',
        'shippingAddress.addressName',
        'address.address1',
        'orderItems.quantity',
        'orderItems.price',
        'sku.code',
        'sku.price',
        'sku.salePrice',
        'sku.discountPercentage',
        'sku.stockQuantity',
        'sku.product',
        'product.productName',
        'product.slug',
        'product.featuredImage',
        'payment.paymentMethod',
        'payment.status',
      ])

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string, currentUser: AuthUser) {
    const userId = currentUser.role === Roles.ADMIN ? undefined : currentUser.userId

    const existing = await this.ordersRepo.findOne({
      where: [
        { id, user: { id: userId } },
        { trackingNumber: id, user: { id: userId } }
      ],
      relations: {
        user: {
          account: true
        },
        orderItems: {
          sku: {
            product: true
          },
        },
        shippingAddress: {
          address: true
        },
        payment: true
      },
      select: {
        trackingNumber: true,
        id: true,
        orderDate: true,
        totalAmount: true,
        status: true,
        orderItems: true,
        user: {
          id: true,
          phone: true,
          account: {
            firstName: true,
            lastName: true,
            id: true,
            email: true
          }
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

    if (existing.status === OrderStatus.COMPLETED || existing.status === OrderStatus.CANCELLED) throw new BadRequestException('Order already delivered')

    existing.status = updateOrderDto.status;

    await this.ordersRepository.saveOrder(existing); // transaction
    updateOrderDto.status === OrderStatus.COMPLETED && await this.paymentService.update(existing.payment.id, { status: PaymentStatus.COMPLETED })

    // TODO: NOTIFY CUSTOMER BY SENDING EMAIL ABOUT THE ORDER STATUS

    return {
      message: 'Order updated',
    }
  }

  async cancelOrder(id: string, cancelOrderDto: CancelOrderDto, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);
    if (!existing) throw new NotFoundException('Order not found')

    if (existing.status !== OrderStatus.PENDING) throw new BadRequestException('Order cannot be cancelled now.')

    // INCREASE THE PRODUCT STOCK
    for (const orderItem of existing.orderItems) {
      const sku = orderItem.sku;
      if (!sku) throw new BadRequestException(`Not available: ${sku.product.productName}`);
      sku.stockQuantity += orderItem.quantity;
      await this.skuRepository.saveSku(sku);
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
    await this.paymentService.update(existing.payment.id, { status: PaymentStatus.FAILED });

    return {
      message: "Order cancelled",
    }
  }
}
