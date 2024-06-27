import { BaseEntity } from "src/core/entities/base.entity";
import { Country } from "src/core/types/country.type";
import { ShippingAddress } from "src/shipping-addresses/entities/shipping-address.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

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

    @OneToOne(() => User, (user) => user.address, { cascade: true, nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    user?: User;

    @OneToOne(() => ShippingAddress, (shippingAddress) => shippingAddress.address, { cascade: true, nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    shippingAddress?: Address;
}
