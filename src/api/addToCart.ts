/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
"use strict";
import CartActions from "../services/products/cartActions";

export class AddToCart  {
	static params: {
		userId: "string";
		product: { type: "object" };
	};
	static rest = "POST /cart/:userId";
	public async $handler(ctx: any):Promise<{message:string}> {

		const entity = ctx.params.product;

		await new CartActions(ctx.params.userId, null).createCart(entity);
        
		return { message: "Item added to cart" };
	}
}
