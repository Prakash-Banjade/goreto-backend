import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Sku } from "../skus/entities/sku.entity";

@Entity()
export class Discount extends BaseEntity {
    // @OneToOne(() => Sku, sku => sku.discount, { onDelete: 'CASCADE' })
    // @JoinColumn()
    // sku: Sku;

    @Column({ type: 'real' })
    discountPercentage: number;

    @Column({ type: 'datetime' })
    startDate: string;

    @Column({ type: 'datetime' })
    endDate: string;
}