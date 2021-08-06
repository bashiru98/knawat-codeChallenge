/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
"use strict";
import CartActions from "../services/products/cartActions";

export class GetCartSummary {
	static params: {
		userId: "string";
	};
	static rest = "GET /cart/summary/:userId";

	public async $handler(ctx: any) {
		return await new CartActions(ctx.params.userId, null).getCartSummary();
	}
}
