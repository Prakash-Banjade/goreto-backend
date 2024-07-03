import { Cart } from "src/carts/entities/cart.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { Product } from "src/products/entities/product.entity";
import { Sku } from "src/products/skus/entities/sku.entity";
import { BeforeInsert, Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class CartItem extends BaseEntity {
    @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: "CASCADE" })
    cart: Cart;

    @ManyToOne(() => Sku, (sku) => sku.cartItems)
    sku: Sku;

    @ManyToOne(() => Product, (simpleProduct) => simpleProduct.cartItems)
    simpleProduct: Product;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({ type: 'real' })
    price: number;

    @BeforeInsert()
    calculatePrice() {
        if (this.simpleProduct?.salePrice) {
            this.price = this.simpleProduct.salePrice
        } else if (this.sku?.salePrice) {
            this.price = this.sku?.salePrice
        }
    }
}
