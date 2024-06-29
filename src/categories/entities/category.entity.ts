import { BaseEntity } from "src/core/entities/base.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Category extends BaseEntity {
    @Column({ type: 'varchar' })
    categoryName: string;

    @Column({ type: 'text' })
    slug: string;

    @Column({ type: 'varchar' })
    coverImage: string;

    @Column({ type: 'longtext' })
    description: string;

    @OneToMany(() => Product, (product) => product.category, { nullable: true })
    products: Product[]
}
