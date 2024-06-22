import { Address } from "src/addresses/entities/address.entity";
import { CONSTANTS } from "src/core/CONSTANTS";
import { BaseEntity } from "src/core/entities/base.entity";
import { Order } from "src/orders/entities/order.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity()
export class ShippingAddress extends BaseEntity {
    @ManyToOne(() => User, (user) => user.shippingAddresses, { onDelete: 'CASCADE' })
    user!: User

    @OneToOne(() => Address, (address) => address.shippingAddress, { onDelete: 'RESTRICT' })
    address!: Address

    @Column({ type: 'boolean', default: false })
    default!: boolean

    @OneToMany(() => Order, (order) => order.shippingAddress, { nullable: true })
    orders!: Order[]

    @Column({ type: 'varchar', default: CONSTANTS.defaultAddressName })
    addressName!: string
}
