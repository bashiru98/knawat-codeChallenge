"use strict";
import CartActions from "../services/products/cartActions"

export class AddToCart {
    static params: {
        userId: "string",
        product: { type: "object" },
    }
    static rest : {
        method: "POST",
        path: "/:userId/cart",
    }

    public async $handler(ctx:any) {
        const entity = ctx.params.product
        const res = await new CartActions(ctx.params.userId, null).createCart(entity);
        return { message:"Item added to cart" }
    }
}