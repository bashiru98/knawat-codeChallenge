"use strict";

export default class Validate {
	static user = {
		username: "string|min:2",
		password: "string|min:2",
		email: "email",
	};

	static product = {
		name: "string|min:3",
		price: "number|positive",
		productId: "string",
		quantity: "number|positive",
	};
}
