import { CartItem } from "src/cart-items/entities/cart-item.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

@Entity()
export class Cart extends BaseEntity {
    @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
    @JoinColumn()
    user!: User

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { nullable: true })
    cartItems!: CartItem[]
}
