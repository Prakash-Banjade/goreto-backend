import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Sku } from "./sku.entity";
import { Product } from "src/products/entities/product.entity";

@Entity()
export class ProductImage extends BaseEntity {
    @Column({ type: "varchar", nullable: false })
    url: string;

    @ManyToOne(() => Sku, (sku) => sku.gallery, { onDelete: "CASCADE" })
    sku: Sku;

    @ManyToOne(() => Product, (product) => product.gallery, { onDelete: "CASCADE" })
    simpleProduct: Product;
}