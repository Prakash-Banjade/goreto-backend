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
import { SubCategory } from "src/categories/entities/sub-category.entity";
import { Sku } from "../skus/entities/sku.entity";
import { generateSlug } from "src/core/utils/generateSlug";
import { generateProductCode } from "src/core/utils/generateProductCode";

@Entity()
export class Product extends BaseEntity {
    @Column({ type: 'varchar' })
    productName: string

    @Column({ type: 'text', nullable: true })
    slug: string;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        this.slug = generateSlug(this.productName);
    }

    @Column({ type: 'longtext' })
    description: string

    @Column({ type: 'text', nullable: true })
    code: string

    @BeforeInsert()
    generateCode() {
        this.code = generateProductCode(this.productName);
    }

    // @Column({ type: 'real', precision: 10, scale: 2 })
    // price: number

    @Column({ type: 'varchar', default: CONSTANTS.defaultProductPriceUnit })
    priceUnit: string

    @OneToMany(() => Sku, sku => sku.product)
    skus: Sku[];

    @Column({ type: 'real', precision: 10, scale: 2, default: 0 })
    currentPrice: number

    @Column({ type: 'varchar' })
    coverImage: string

    @ManyToOne(() => SubCategory, subCategory => subCategory.products, { onDelete: 'RESTRICT' })
    subCategory: SubCategory

    @ManyToOne(() => CutType, cutType => cutType.products, { nullable: true })
    cutType: CutType

    @ManyToOne(() => Preparation, preparation => preparation.products, { nullable: true })
    preparation: Preparation

    @OneToMany(() => Review, review => review.product, { nullable: true })
    reviews: Review[]

    @Column({ type: 'real', default: 0 })
    rating: number

    @Column({ type: 'int', default: 0 })
    soldCount: number
}
