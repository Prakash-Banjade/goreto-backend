import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Sku } from "./sku.entity";

@Entity()
export class ProductSkuImage extends BaseEntity {
    @Column({ type: "varchar", nullable: false })
    url: string;

    @ManyToOne(() => Sku, (sku) => sku.images, { onDelete: "CASCADE" })
    sku: Sku;
}