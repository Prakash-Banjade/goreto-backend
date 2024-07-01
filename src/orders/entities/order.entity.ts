import { BaseEntity } from "src/core/entities/base.entity";
import { OrderStatus } from "src/core/types/global.types";
import { Payment } from "src/payments/entities/payment.entity";
import { ShippingAddress } from "src/shipping-addresses/entities/shipping-address.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { CanceledOrder } from "./canceled-order.entity";
import { generateTrackingNumber } from "src/core/utils/generateTrackingNumber";

@Entity()
export class Order extends BaseEntity {
    @Column({ type: 'varchar' })
    trackingNumber: string;

    @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
    user: User

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[]

    @Column({ type: "datetime" })
    orderDate: string;

    @BeforeInsert()
    setOrderDate() {
        this.orderDate = new Date().toISOString();
    }

    @Column({ type: 'real' })
    totalAmount: number

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @ManyToOne(() => ShippingAddress, shippingAddress => shippingAddress.orders, { onDelete: 'RESTRICT' })
    shippingAddress: ShippingAddress

    @OneToOne(() => Payment, payment => payment.order, { onDelete: 'RESTRICT' })
    @JoinColumn()
    payment: Payment

    @OneToOne(() => CanceledOrder, canceledOrder => canceledOrder.order, { onDelete: 'RESTRICT', nullable: true })
    @JoinColumn()
    canceledOrder: CanceledOrder

    @BeforeInsert()
    generateTrackingNumber() {
        this.trackingNumber = generateTrackingNumber()
    }
}
