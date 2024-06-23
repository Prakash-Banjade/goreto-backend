import { Category } from "src/categories/entities/category.entity";
import { CONSTANTS } from "src/core/CONSTANTS";
import { BaseEntity } from "src/core/entities/base.entity";
import { CutType } from "src/product-filters/cut-types/entities/cut-type.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Discount } from "./discount.entity";
import { Preparation } from "src/product-filters/preparations/entities/preparation.entity";
import { CartItem } from "src/cart-items/entities/cart-item.entity";
import { Review } from "src/reviews/entities/review.entity";
import { OrderItem } from "src/orders/entities/order-item.entity";

@Entity()
export class Product extends BaseEntity {
    @Column({ type: 'varchar' })
    productName: string

    @Column({ type: 'text', nullable: true })
    slug: string;

    @Column({ type: 'longtext' })
    description: string

    @Column({ type: 'simple-array' })
    productOptions: string[]

    @Column({ type: 'real', precision: 10, scale: 2 })
    price: number

    @Column({ type: 'varchar', default: CONSTANTS.defaultProductPriceUnit })
    priceUnit: string

    @Column({ type: 'real', precision: 10, scale: 2 })
    currentPrice: number

    @Column({ type: 'int', default: 0 })
    stockQuantity: number

    @Column({ type: 'varchar' })
    coverImage: string

    @Column({ type: 'simple-array', nullable: true })
    otherImages?: string[]

    @ManyToOne(() => Category, category => category.products)
    category: Category

    @ManyToOne(() => CutType, cutType => cutType.products)
    cutType: CutType

    @ManyToOne(() => Preparation, preparation => preparation.products, { nullable: true })
    preparation: Preparation

    @OneToOne(() => Discount, discount => discount.product, { nullable: true })
    discount: Discount

    @OneToMany(() => CartItem, cartItem => cartItem.product, { nullable: true })
    cartItems: CartItem[]

    @OneToMany(() => Review, review => review.product, { nullable: true })
    reviews: Review[]

    @BeforeUpdate()
    @BeforeInsert()
    calculateCurrentPrice() {
        this.currentPrice = this.discount ? this.price - (this.price * this.discount?.discountPercentage / 100) : this.price;
    }

    @OneToMany(() => OrderItem, orderItem => orderItem.product, { nullable: true })
    orderItems: OrderItem[]
}
