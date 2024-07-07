import { BaseEntity } from 'src/core/entities/base.entity';
import { generateAttributeCode } from 'src/core/utils/generateAttributeCode';
import { AttributeOption } from 'src/products/attribute-options/entities/attribute-option.entity';
import { Entity, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class Attribute extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    code: string;

    @BeforeInsert()
    @BeforeUpdate()
    async generateCode() {
        if (!this.code) this.code = generateAttributeCode();
    }

    @OneToMany(() => AttributeOption, attributeOption => attributeOption.attribute, { nullable: true })
    attributeOptions: AttributeOption[];
}
