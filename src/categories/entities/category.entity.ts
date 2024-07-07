import { BaseEntity } from "src/core/entities/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from "typeorm";
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
        if (!this.slug && this.categoryName) this.slug = generateSlug(this.categoryName, false);
    }

    @Column({ type: 'varchar' })
    featuredImage: string;

    @Column({ type: 'longtext' })
    description: string;

    @OneToMany(() => Product, (product) => product.category, { nullable: true })
    products?: Product[]

    @ManyToOne(() => Category, (category) => category.parentCategory, { nullable: true })
    parentCategory: Category

    /**
    |--------------------------------------------------
    | BELOW COLUMSN ARE FOR NESTED SET MODEL. THEY ARE USED TO GRAB PRODUCTS OF A CATEGORY AND ALL ITS NESTED CHILDREN TOO.
    |--------------------------------------------------
    */

    @Column({ type: 'int' })
    left: number;

    @Column({ type: 'int' })
    right: number;
}
