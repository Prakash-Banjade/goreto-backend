import { Address } from "src/addresses/entities/address.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class ShippingAddress extends BaseEntity {
    @ManyToOne(() => User, (user) => user.shippingAddresses, { onDelete: 'CASCADE' })
    user!: User

    @OneToOne(() => Address, (address) => address.shippingAddress, { onDelete: 'RESTRICT' })
    address!: Address

    @Column({ type: 'boolean', default: false })
    default!: boolean
}
