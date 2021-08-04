"use strict";
import CartActions from "../services/products/cartActions";

export class GetCartSummary {
	static params: {
		userId: "string";
	};
	static rest = "GET /:userId/cart/summary";

	public async $handler(ctx: any) {
		return await new CartActions(ctx.params.userId, null).getCartSummary();
	}
}