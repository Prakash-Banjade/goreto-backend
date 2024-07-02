import { BaseEntity } from 'src/core/entities/base.entity';
import { AttributeOption } from 'src/products/attribute-options/entities/attribute-option.entity';
import { Sku } from 'src/products/skus/entities/sku.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class AttributeOptionSku extends BaseEntity {
    // @ManyToOne(() => Sku, sku => sku.attributeOptionSkus)
    // sku: Sku;

    // @ManyToOne(() => AttributeOption, attributeOption => attributeOption.attributeOptionSkus)
    // attributeOption: AttributeOption;
}
