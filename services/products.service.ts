/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use strict";

import { Service, ServiceBroker } from "moleculer";
import Validate from "../src/utils/validators";
import DbConnection from "../mixins/db.mixin";
import { AddToCart } from "../src/api/addToCart";
import { GetCartSummary } from "../src/api/getCartSummary";
export default class ProductsService extends Service {
	private DbMixin = new DbConnection("products").start();

	// @ts-ignore
	public constructor(public broker: ServiceBroker, schema:ServiceSchema<{}> = {}) {
		super(broker);
		this.parseServiceSchema(
			Service.mergeSchemas(
				{
					name: "products",
					mixins: [this.DbMixin],
					settings: {
						// Validator for cart creation.
						entityValidator: Validate.product,
					},
					actions: {
						addProductToCart: {
							rest: AddToCart.rest,
							params: { ...AddToCart.params },
							async handler(ctx) {
								const entity = ctx.params.product;
								await this.validateEntity(entity);
								await this.broker.cacher?.clean(ctx.params.userId);
								return await new AddToCart().$handler(ctx);
							},
						},
						getCartSummary: {
							rest: GetCartSummary.rest,
							params: { ...GetCartSummary.params },
							async handler(ctx) {
								try {
									const cache = await this.broker.cacher.get(
										ctx.params.userId
									);
									if (cache) {
										console.log("from cache",cache)
										// @ts-expect-error
										return JSON.parse(cache);
									}
									const res = await new GetCartSummary().$handler(
										ctx
									);
	
									await this.broker.cacher.set(
										ctx.params.userId,
										JSON.stringify(res)
									);
	
									return res;
								} catch (error) {
									return {message:"no items in your cart"}
								}
								
							},
						},
					},
					methods: {
						async seedDB() {
							await this.adapter.insertMany([
								{
									name: "Samsung Galaxy S10 Plus",
									quantity: 10,
									price: 704,
								},
								{
									name: "iPhone 11 Pro",
									quantity: 25,
									price: 999,
								},
								{
									name: "Huawei P30 Pro",
									quantity: 15,
									price: 679,
								},
							]);
						},
					},
				},
				schema
			)
		);
	}
}