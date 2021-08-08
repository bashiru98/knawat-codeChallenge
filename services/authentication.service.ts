  
"use strict";

import { Service, ServiceBroker } from "moleculer";
import { Register } from "../src/api/register";
import { Login } from "../src/api/login";
import Validate from "../src/utils/validators";
import { userSchema } from "../src/models/user";
import DbConnection from "../mixins/db.mixin";
import { UserAction } from "../src/services/users/index";

import { Errors } from "moleculer"

export default class AuthenticationService extends Service {
	private DbMixin = new DbConnection("users").start();
	public constructor(public broker: ServiceBroker) {
		super(broker);
		new UserAction().createIndex("users");

		this.parseServiceSchema({
			name: "authentication",

			mixins: [this.DbMixin],
			settings: {
				// Validator user before registration actions.
				entityValidator: Validate.user,
			},
			actions: {
				/**
				 * Register  action.
				 *
				 */
				register: {
					rest: { ...Register.rest },
					params: { ...Register.params },
					async handler(ctx) {
						const entity = ctx.params.user;
						await this.validateEntity(entity);
						const userData = userSchema(entity);
						const user = await this.transformDocuments(
							ctx,
							{},
							{ ...userData }
						);
						return await new Register(entity, { ...user }).$handler(
							ctx,
							user
						);
					},
				},
				login: {
					rest: { ...Login.rest },
					params: { ...Login.params },
					async handler(ctx) {
						try {
							const user = await new Login().$handler(ctx);
							
							const doc = await this.transformDocuments(
								ctx,
								{},
								JSON.parse(user)
							);
							doc.password = null;
							return await new Login().transformEntity(
								doc,
								true,
								ctx.meta.token
							);
						} catch (err) {
							console.log("catch", err);
							throw new Errors.MoleculerClientError(
								"invalid credentials",
								400,
								""
							);
						}
					},
				},
			},
		});
	}
}