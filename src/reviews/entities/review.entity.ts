import { BaseEntity } from "src/core/entities/base.entity";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Review extends BaseEntity {
    @ManyToOne(() => User, (user) => user.reviews)
    user: User

    @Column({ type: 'real', default: 0 })
    rating: number;

    @Column({ type: 'longtext', nullable: true })
    comment?: string

    @ManyToOne(() => Product, (product) => product.reviews)
    product: Product
}
