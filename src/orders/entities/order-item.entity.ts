import { BaseEntity } from "src/core/entities/base.entity";
import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class OrderItem extends BaseEntity {
    @ManyToOne(() => Order, order => order.orderItems, { onDelete: 'RESTRICT' })
    order: Order

    @ManyToOne(() => Product, product => product.orderItems, { onDelete: 'RESTRICT' })
    product: Product

    @Column({ type: 'int' })
    quantity: number

    @Column({ type: 'real' })
    price: number

    @BeforeInsert()
    @BeforeUpdate()
    calculatePrice() {
        this.price = this.product.currentPrice * this.quantity;
    }
}
