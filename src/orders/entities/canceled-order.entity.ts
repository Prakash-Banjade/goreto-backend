import { BaseEntity } from "src/core/entities/base.entity";
import { BeforeInsert, Column, Entity, OneToOne } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class CanceledOrder extends BaseEntity {
    @OneToOne(() => Order, (order) => order.canceledOrder)
    order: Order

    @Column({ type: "datetime" })
    canceledDate: string

    @BeforeInsert()
    setCanceledDate() {
        this.canceledDate = new Date().toISOString();
    }

    @Column({ type: 'text' })
    reason: string

    @Column({ type: 'longtext', nullable: true })
    description?: string
}