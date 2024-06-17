import { BaseEntity } from "src/core/entities/base.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class CutType extends BaseEntity {
    @Column({ type: 'varchar' })
    cutTypeName: string;

    @Column({ type: "longtext" })
    description: string;

    @OneToMany(() => Product, (product) => product.cutType, { nullable: true })
    products: Product[];
}
