import { BaseEntity } from "src/core/entities/base.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { SubCategory } from "./sub-category.entity";

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

    @OneToMany(() => SubCategory, (subCategory) => subCategory.category, { nullable: true })
    subCategories: Category[]
}
