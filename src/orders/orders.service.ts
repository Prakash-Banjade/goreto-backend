import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Brackets, IsNull, Not, Or, Repository } from 'typeorm';
import { OrderQueryDto } from './dto/order-query.dto';
import { AuthUser, OrderStatus, Roles } from 'src/core/types/global.types';
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
import { ProductsRepository } from 'src/products/repository/product.repository';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    private readonly ordersRepository: OrdersRepository,
    @InjectRepository(OrderItem) private readonly orderItemsRepo: Repository<OrderItem>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly orderItemsRepository: OrderItemsRepository,
    @InjectRepository(Sku) private readonly skuRepo: Repository<Sku>,
    private readonly skuRepository: SkuRepository,
    private readonly productRepository: ProductsRepository,
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
    const cart = await this.cartsService.findMyCart(currentUser);
    if (!cart) throw new NotFoundException('Cart not found');

    const cartItems = cart.cartItems.filter(item => item.selected);


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
    for (const cartItem of cartItems) {
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

    // TODO: REMOVE CART-ITEMS AFTER ORDER IS CREATED ??

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
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("order.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoinAndSelect("order.orderItems", "orderItems")
      .leftJoinAndSelect("orderItems.sku", "sku")
      .leftJoinAndSelect("orderItems.simpleProduct", "simpleProduct")
      // .leftJoinAndSelect("sku", "sku.product AS productSku")
      .leftJoinAndSelect("order.payment", "payment")
      .andWhere(new Brackets(qb => {
        qb.where([
          // { productName: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
        currentUser.role === Roles.USER && qb.andWhere({ user: { id: currentUser.userId } });
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string, currentUser: AuthUser) {
    const userId = currentUser.role === Roles.ADMIN ? undefined : currentUser.userId

    const existing = await this.ordersRepo.findOne({
      where: { id, user: { id: userId } },
      relations: {
        orderItems: {
          sku: {
            product: true
          },
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

    return {
      message: "Order cancelled",
    }
  }

}
