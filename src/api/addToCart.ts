"use strict";
import CartActions from "../services/products/cartActions";

export class AddToCart {
	static params: {
		userId: "string";
		product: { type: "object" };
	};
	static rest = "POST /:userId/cart";

	public async $handler(ctx: any) {
		const entity = ctx.params.product;
		await new CartActions(ctx.params.userId, null).createCart(entity);
		return { message: "Item added to cart" };
	}
}
