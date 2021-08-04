"use strict";

import { Service, ServiceBroker, ServiceSchema } from "moleculer";
import Validate from "../src/utils/validators"
import DbConnection from "../mixins/db.mixin";
import CartActions from "../src/services/products/cartActions"
export default class ProductsService extends Service{

	private DbMixin = new DbConnection("products").start();

	// @ts-ignore
	public  constructor(public broker: ServiceBroker, schema: ServiceSchema<{}> = {}) {
		super(broker);
		this.parseServiceSchema(Service.mergeSchemas({
			name: "products",
			mixins: [this.DbMixin],
			settings: {
				// Validator for cart creation.
				entityValidator: Validate.product,
			},
			actions: {
				addProductToCart: {
					rest: "POST /:userId/cart",
					params: {
						userId: "string",
						product: { type: "object" },
					},
					async handler(ctx) {
						const entity = ctx.params.product
						await this.validateEntity(entity)
						const res = await new CartActions(ctx.params.userId, null).createCart(entity);
					    await this.broker.cacher.clean(ctx.params.userId)
						return {message:"Item added to cart",data:res}
					 }
				},
				getCartSummary: {
					rest: "GET /:userId/cart/summary",
					params: {
						userId: "string",
					},
					async handler(ctx) {
						const cache = await this.broker.cacher.get(ctx.params.userId)
						if (cache) {
							
							// @ts-expect-error
							return JSON.parse(cache)
						}
						const res =  await new CartActions(ctx.params.userId, null).getCartSummary();
						await this.broker.cacher.set(ctx.params.userId, JSON.stringify(res))
						
						return res
					 }
				},
				
			},
			methods: {
				async seedDB() {
					await this.adapter.insertMany([
						{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
						{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
						{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
					]);
				},
			},
		}, schema));
	}
}
