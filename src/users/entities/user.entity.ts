import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { Gender } from "src/core/types/global.types";
import { Address } from "src/addresses/entities/address.entity";
import { Account } from "src/accounts/entities/account.entity";
import { ShippingAddress } from "src/shipping-addresses/entities/shipping-address.entity";
import { Cart } from "src/carts/entities/cart.entity";

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

    @OneToMany(() => ShippingAddress, shippingAdddress => shippingAdddress.user, { nullable: true })
    shippingAddresses?: ShippingAddress[]

    @OneToOne(() => Account, account => account.user, { nullable: true })
    account: Account

    @OneToOne(() => Cart, cart => cart.user)
    cart: Cart

}
