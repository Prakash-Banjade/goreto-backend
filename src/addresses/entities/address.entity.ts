import { BaseEntity } from "src/core/entities/base.entity";
import { Country } from "src/core/types/country.type";
import { Column, Entity } from "typeorm";

@Entity()
export class Address extends BaseEntity {
    @Column({ type: 'varchar' })
    address1!: string;

    @Column({ type: 'varchar', nullable: true })
    address2?: string;

    @Column({ type: 'varchar' })
    city!: string;

    @Column({ type: 'enum', enum: Country })
    country!: Country;

    province!: string;

    @Column({ type: 'int', unsigned: true })
    zipCode!: number;
}
