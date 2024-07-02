import { BaseEntity } from 'src/core/entities/base.entity';
import { AttributeOptionSku } from 'src/products/attribute-option-skus/entities/attribute-option-skus.entity';
import { Attribute } from 'src/products/attributes/entities/attribute.entity';
import { Sku } from 'src/products/skus/entities/sku.entity';
import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class AttributeOption extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    value: string;

    @ManyToOne(() => Attribute, attribute => attribute.attributeOptions, { onDelete: 'CASCADE' })
    attribute: Attribute;

    // @OneToMany(() => AttributeOptionSku, attributeOptionSku => attributeOptionSku.attributeOption, { nullable: true })
    // attributeOptionSkus: AttributeOptionSku[];

    @OneToMany(() => Sku, sku => sku.attributeOptions)
    skus: Sku[];
}
