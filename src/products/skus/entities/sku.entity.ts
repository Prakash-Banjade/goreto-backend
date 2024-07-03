import { BaseEntity } from 'src/core/entities/base.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, Column, ManyToOne, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { AttributeOption } from 'src/products/attribute-options/entities/attribute-option.entity';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { ProductImage } from './product-image.entity';

@Entity()
export class Sku extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    code: string;

    @Column({ type: 'real' })
    price: number;

    @Column({ type: 'real', nullable: true })
    salePrice?: number;

    @Column({ type: 'real', default: 0, scale: 2, precision: 10 })
    discountPercentage?: number;

    @BeforeInsert()
    @BeforeUpdate()
    calculageDiscountPercentage() {
        if (this.salePrice) {
            this.discountPercentage = (this.price - this.salePrice) / this.price * 100
        } else {
            this.salePrice = this.price
        }
    }

    @OneToMany(() => ProductImage, productImage => productImage.sku, { nullable: true })
    gallery: ProductImage[]

    @ManyToOne(() => Product, product => product.skus)
    product: Product;

    @Column({ type: 'int', default: 0 })
    stockQuantity: number;

    @ManyToOne(() => AttributeOption, attributeOption => attributeOption.skus) // TODO: make this ManyToMany
    attributeOptions: AttributeOption

    @OneToMany(() => CartItem, cartItem => cartItem.sku, { nullable: true })
    cartItems: CartItem[]

    @OneToMany(() => OrderItem, orderItem => orderItem.sku, { nullable: true })
    orderItems: OrderItem[]
}
