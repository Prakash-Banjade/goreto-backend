import { BaseEntity } from "src/core/entities/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { generateSlug } from "src/core/utils/generateSlug";
import { Product } from "src/products/entities/product.entity";

@Entity()
export class Category extends BaseEntity {
    @Column({ type: 'varchar' })
    categoryName: string;

    @Column({ type: 'text' })
    slug: string;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (!this.slug) this.slug = generateSlug(this.categoryName, false);
    }

    @Column({ type: 'varchar' })
    featuredImage: string;

    @Column({ type: 'longtext' })
    description: string;

    @OneToMany(() => Product, (product) => product.category, { nullable: true })
    products?: Product[]

    @OneToOne(() => Category, (category) => category.parentCategory, { nullable: true })
    @JoinColumn()
    parentCategory: Category
}
