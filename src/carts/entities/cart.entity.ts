import { CartItem } from "src/cart-items/entities/cart-item.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { AfterLoad, Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

@Entity()
export class Cart extends BaseEntity {
    @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
    @JoinColumn()
    user!: User

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { nullable: true })
    cartItems!: CartItem[]

    @Column({ type: 'real', default: 0 })
    totalAmount: number

    @AfterLoad()
    calculateTotalAmount() {
        this.totalAmount = this.cartItems?.filter(item => item.selected)?.reduce((acc, item) => acc + item.price, 0) ?? 0
    }
}
