import { Cart } from "src/carts/entities/cart.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class CartItem extends BaseEntity {
    @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: "CASCADE" })
    cart: Cart;

    @ManyToOne(() => Product, (product) => product.cartItems)
    product: Product;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({ type: 'real' })
    price: number;

    @BeforeInsert()
    calculatePrice() {
        this.price = this.product.currentPrice * this.quantity;
    }
}
