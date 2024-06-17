import { BaseEntity } from "src/core/entities/base.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Preparation extends BaseEntity {
    @Column({ type: 'varchar' })
    preparationTypeName: string

    @Column({ type: 'longtext' })
    description: string

    @OneToMany(() => Product, product => product.preparation, { nullable: true })
    products: Product[]
}
