import { BaseEntity } from "src/core/entities/base.entity";
import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";
import { Sku } from "src/products/skus/entities/sku.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class OrderItem extends BaseEntity {
    @ManyToOne(() => Order, order => order.orderItems, { onDelete: 'RESTRICT' })
    order: Order

    @ManyToOne(() => Sku, sku => sku.orderItems, { onDelete: 'RESTRICT' })
    sku: Sku

    @ManyToOne(() => Product, (simpleProduct) => simpleProduct.orderItems, { onDelete: 'RESTRICT' })
    simpleProduct: Product;

    @Column({ type: 'int' })
    quantity: number

    @Column({ type: 'real' })
    price: number

    @BeforeInsert()
    @BeforeUpdate()
    calculatePrice() {
        if (this.simpleProduct?.salePrice) {
            this.price = this.simpleProduct.salePrice
        } else if (this.sku?.salePrice) {
            this.price = this.sku?.salePrice
        }
    }
}
