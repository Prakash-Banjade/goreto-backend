import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { Gender } from "src/core/types/global.types";
import { Address } from "src/addresses/entities/address.entity";

@Entity()
export class User extends BaseEntity {
    @Column({ type: 'varchar', nullable: true })
    phone?: string;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender?: Gender

    @Column({ type: 'datetime', nullable: true })
    dob?: string;

    @Column({ type: 'varchar', nullable: true })
    image?: string;

    @OneToOne(() => Address, address => address.user, { nullable: true })
    address?: Address

    @OneToMany(() => Address, address => address.user, { nullable: true })
    shippingAddresses?: Address[]
}
