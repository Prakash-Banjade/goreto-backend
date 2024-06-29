import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./category.entity";
import { Product } from "src/products/entities/product.entity";

@Entity()
export class SubCategory extends BaseEntity {
    @Column({ type: 'varchar' })
    subCategoryName: string

    @Column({ type: 'varchar' })
    slug: string

    @Column({ type: 'varchar', nullable: true })
    coverImage?: string;

    @Column({ type: 'longtext', nullable: true })
    description?: string

    @ManyToOne(() => Category, category => category.subCategories, { onDelete: 'CASCADE' })
    category: Category

    @OneToMany(() => Product, (product) => product.subCategory, { nullable: true })
    products?: Product[]
}