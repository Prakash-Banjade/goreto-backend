import { BaseEntity } from "src/core/entities/base.entity";
import { Order } from "src/orders/entities/order.entity";
import { Sku } from "src/products/skus/entities/sku.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class OrderItem extends BaseEntity {
    @ManyToOne(() => Order, order => order.orderItems, { onDelete: 'RESTRICT' })
    order: Order

    @ManyToOne(() => Sku, sku => sku.orderItems, { onDelete: 'RESTRICT' })
    sku: Sku

    @Column({ type: 'int' })
    quantity: number

    @Column({ type: 'real' })
    price: number

    @BeforeInsert()
    @BeforeUpdate()
    calculatePrice() {
        this.price = this.sku.salePrice * this.quantity;
    }
}
