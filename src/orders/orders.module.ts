import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { CartsModule } from 'src/carts/carts.module';
import { ShippingAddressesModule } from 'src/shipping-addresses/shipping-addresses.module';
import { OrderItem } from './entities/order-item.entity';
import { OrdersRepository } from './repository/order.repository';
import { OrderItemsRepository } from './repository/order-item.repository';
import { PaymentsModule } from 'src/payments/payments.module';
import { CanceledOrder } from './entities/canceled-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Product,
      Payment,
      CanceledOrder,
    ]),
    CartsModule,
    PaymentsModule,
    ShippingAddressesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, OrderItemsRepository],
})
export class OrdersModule {}
