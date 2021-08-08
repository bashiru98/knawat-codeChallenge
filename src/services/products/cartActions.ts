/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use strict";

// @ts-expect-error
import eb from "es-builder";
import { client } from "../../loaders/elastic";

interface Product {
	_id: string;
	price: number;
	name: string;
	quantity: number;
	productId:string;
}
const Q = eb.Q;
const query = eb.QueryBuilder();

class CartActions {
	public formatter: any;

	public cacheValue: string;

	private elasticClient = client;
	private query = query.filter(Q("terms", "userId", [this.userId]));

	public data: any = null;

	constructor(public userId: string, _: any) {
		this.userId = userId;
		this.data = {};
		this.data.totals = 0;
		this.data.formattedTotals = "";
		this.formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		});
	}
	public async createCart(product: Product): Promise<any>{
		const res = await this.elasticClient.index({
			index: this.userId,
			type:"product_data",
			id: product.productId,
			body: {
				name: product.name,
				productId: product.productId,
				userId: this.userId,
				quantity: product.quantity,
				price: product.price,
				totalPrice: product.price * product.quantity,
				createdAt: new Date(),
			},
		});
		return res.body;
	}

	public async getCartSummary(): Promise<any> {
    try {
		const res = await this.elasticClient.search({
			index: this.userId,		
			body: {
				aggs: {
					sum_total: {
						sum: {
							field: "totalPrice",
						},
					},
					quantity_total: {
						sum: {
							field: "quantity",
						},
					},
				},
			},
		});
		return  { cartSummary: {
			cartItems: res.body?.hits.hits,
			totalQuantity: res.body?.aggregations.quantity_total.value,
			totalPrice: this.formatter.format(
				res.body?.aggregations.sum_total.value
			),
		} };
	} catch (error) {
		console.log("error in code" ,error)
	}
		
	}
}

export default CartActions;
