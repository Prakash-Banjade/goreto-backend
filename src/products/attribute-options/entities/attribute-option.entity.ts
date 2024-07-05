import { BaseEntity } from 'src/core/entities/base.entity';
import { Attribute } from 'src/products/attributes/entities/attribute.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class AttributeOption extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    value: string;

    @Column({ type: 'varchar', length: 255 })
    meta: string;

    @ManyToOne(() => Attribute, attribute => attribute.attributeOptions, { onDelete: 'CASCADE' })
    attribute: Attribute;
}
