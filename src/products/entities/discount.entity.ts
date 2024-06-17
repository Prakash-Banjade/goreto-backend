import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Discount extends BaseEntity {
    @OneToOne(() => Product, product => product.discount)
    @JoinColumn()
    product: Product;

    @Column({ type: 'real' })
    discountPercentage: number;

    @Column({ type: 'datetime' })
    startDate: string;

    @Column({ type: 'datetime' })
    endDate: string;
}