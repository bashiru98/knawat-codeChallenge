/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
"use strict";

import { Mixin } from "ts-mixer";

import { Errors } from "moleculer"

import { Token } from "../utils/token";
import { UserPayload } from "../utils/types";
import { UserAction } from "../services/users/index";
import { Password } from "../utils/password";

export class Login extends Mixin(Password, Token, UserAction) {
	static params: {
		user: {
			type: "object";
			props: {
				email: { type: "email" };
				password: { type: "string" };
			};
		};
	};
	static rest: {
		method: "POST";
		path: "/login";
	};
	constructor() {
		super();
	}
	public async $handler(ctx: any): Promise<any> {
		const user = await super.getUser(ctx.params.user.email);
		if (!user) {
			throw new Errors.MoleculerClientError(
				"Email or password is invalid!",
				400,
				"",
				[{ field: "email", message: "is not found" }]
			);
		}

		const res = await super.compare(
			JSON.parse(user).password,
			ctx.params.user.password
		);
		if (!res) {
			// Let the error be generic
			throw new Errors.MoleculerClientError("invalid password ", 422, "");
		}
		return user;
	}

	public getToken(user: UserPayload) :Promise<string>{
		return super.generateToken(user);
	}
	public async transformEntity(user: any, withToken: boolean, token: string):Promise<any> {
		if (user) {
			if (withToken) {
				user.token = token || (await this.getToken(user));
			}
		}
		return { user };
	}
}
