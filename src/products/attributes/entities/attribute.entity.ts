import { BaseEntity } from 'src/core/entities/base.entity';
import { AttributeOption } from 'src/products/attribute-options/entities/attribute-option.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Attribute extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    code: string;

    @OneToMany(() => AttributeOption, attributeOption => attributeOption.attribute, { nullable: true })
    attributeOptions: AttributeOption[];
}
