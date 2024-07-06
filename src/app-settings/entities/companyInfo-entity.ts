import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class CompanyInfoSetting extends BaseEntity {
    @Column({ type: 'varchar', default: '' })
    city: string;

    @Column({ type: 'varchar', default: '' })
    addressLine1: string;

    @Column({ type: 'varchar', default: '' })
    addressLine2: string;

    @Column({ type: 'varchar', default: '' })
    streetAddress: string;

    @Column({ type: 'varchar', default: '' })
    emirate: string;

    @Column({ type: 'varchar', default: '' })
    poBox: string;

    @Column({ type: 'varchar', default: '' })
    phone: string;

    @Column({ type: 'varchar', default: '' })
    alternatePhone: string;

    @Column({ type: 'varchar', default: '' })
    email: string;

    @Column({ type: 'varchar', default: '' })
    website: string;

    @Column({ type: 'varchar', default: '' })
    socialProfiles: string;
}