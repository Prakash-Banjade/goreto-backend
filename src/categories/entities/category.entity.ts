import { BaseEntity } from "src/core/entities/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import { SubCategory } from "./sub-category.entity";
import { generateSlug } from "src/core/utils/generateSlug";

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
    coverImage: string;

    @Column({ type: 'longtext' })
    description: string;

    @OneToMany(() => SubCategory, (subCategory) => subCategory.category, { nullable: true })
    subCategories: Category[]
}
