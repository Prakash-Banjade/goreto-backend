import { Category } from "src/categories/entities/category.entity";
import { CONSTANTS } from "src/core/CONSTANTS";
import { BaseEntity } from "src/core/entities/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Review } from "src/reviews/entities/review.entity";
import { Sku } from "../skus/entities/sku.entity";
import { generateSlug } from "src/core/utils/generateSlug";
import { generateProductCode } from "src/core/utils/generateProductCode";
import { ProductType } from "src/core/types/global.types";
import { ProductImage } from "../skus/entities/product-image.entity";
import { CartItem } from "src/cart-items/entities/cart-item.entity";
import { OrderItem } from "src/orders/entities/order-item.entity";

@Entity()
export class Product extends BaseEntity {
    @Column({ type: 'text', nullable: true })
    code: string

    @BeforeInsert()
    generateCode() {
        this.code = generateProductCode(this.productName);
    }

    @Column({ type: 'varchar' })
    productName: string

    @Column({ type: 'text', nullable: true })
    slug: string;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (!this.slug) this.slug = generateSlug(this.productName);
    }

    @Column({ type: 'longtext' })
    description: string

    @Column({ type: 'enum', enum: ProductType, default: ProductType.VARIABLE })
    productType: ProductType

    @Column({ type: 'varchar', default: CONSTANTS.defaultProductPriceUnit })
    priceUnit: string

    @OneToMany(() => ProductImage, productImage => productImage.simpleProduct, { nullable: true })
    gallery: ProductImage[]

    @Column({ type: 'varchar' })
    featuredImage: string

    @ManyToOne(() => Category, category => category.products, { onDelete: 'RESTRICT' })
    category: Category

    @OneToMany(() => Review, review => review.product, { nullable: true })
    reviews: Review[]

    @Column({ type: 'real', default: 0 })
    rating: number

    @BeforeInsert()
    @BeforeUpdate()
    refactorByType() {
        if (this.productType === ProductType.VARIABLE) {
            this.price = null;
            this.salePrice = null;
            this.discountPercentage = 0;
            this.stockQuantity = 0;
        }
    }

    /**
    |--------------------------------------------------
    | Below are the columns that are only for variable products
    |--------------------------------------------------
    */

    @OneToMany(() => Sku, sku => sku.product)
    skus: Sku[];


    /**
    |--------------------------------------------------
    | Below are the columns that are only for simple products
    |--------------------------------------------------
    */

    @Column({ type: 'real', precision: 10, scale: 2, nullable: true })
    price: number

    @Column({ type: 'real', nullable: true })
    salePrice?: number;

    @Column({ type: 'real', default: 0, scale: 2, precision: 10 })
    discountPercentage?: number;

    @BeforeInsert()
    @BeforeUpdate()
    calculageDiscountPercentage() {
        if (this.salePrice && this.productType === ProductType.SIMPLE) {
            this.discountPercentage = (this.price - this.salePrice) / this.price * 100
        } else {
            this.salePrice = this.price
        }
    }

    @Column({ type: 'int', default: 0 })
    stockQuantity: number;

    @Column({ type: 'int', default: 0 })
    soldCount: number

    @OneToMany(() => CartItem, cartItem => cartItem.simpleProduct, { nullable: true })
    cartItems: CartItem[]

    @OneToMany(() => OrderItem, orderItem => orderItem.simpleProduct, { nullable: true })
    orderItems: OrderItem[]
}
