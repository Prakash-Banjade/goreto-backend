import { BaseEntity } from "src/core/entities/base.entity";
import { PaymentMethod, PaymentStatus } from "src/core/types/global.types";
import { Order } from "src/orders/entities/order.entity";
import { BeforeInsert, Column, Entity, OneToOne } from "typeorm";

@Entity()
export class Payment extends BaseEntity {
    @OneToOne(() => Order, (order) => order.payment)
    order: Order

    @Column({ type: 'datetime' })
    paymentDate: string;

    @BeforeInsert()
    setPaymentDate() {
        this.paymentDate = new Date().toISOString();
    }

    @Column({ type: "real" })
    amount: number

    @BeforeInsert()
    setAmount() {
        this.amount = this.order.totalAmount
    }

    @Column({ type: 'enum', enum: PaymentMethod })
    paymentMethod: PaymentMethod

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus

    @Column({ type: 'uuid', nullable: true })
    paymentIntentId: string

    @Column({ type: 'varchar', nullable: true })
    stripePaymentMethod: string

    @Column({ type: 'varchar', nullable: true })
    clientSecret: string
}
