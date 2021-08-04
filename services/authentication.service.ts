"use strict";
import { Register } from "../src/api/register";
import { Password } from "../src/utils/password"
import Validate from "../src/utils/validators"
import { Service, ServiceBroker } from "moleculer";
import { userSchema } from "../src/models/user"
import DbConnection from "../mixins/db.mixin";
import { UserAction } from "../src/services/users/index"
const { MoleculerClientError } = require("moleculer").Errors;

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
				entityValidator: Validate.user
			},
			methods: {
				transformEntity(user, withToken, token) {
					if (user) {
						if (withToken) {
							user.token = token || this.getToken(user);
						}
					}
					return { user };
				},
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
						const userData = userSchema(entity)
						const user = await this.transformDocuments(
							ctx,
							{},
							{...userData},
						);
						console.log("user doc", user)
						return await new Register(entity,{...user}).$handler(ctx,user)

					},
				},
				login: {
					rest: {
						method: "POST",
						path: "/login",
					},
					params: {
						user: {
							type: "object",
							props: {
								email: { type: "email" },
								password: { type: "string", min: 1 },
							},
						},
					},
					async handler(ctx) {
						try {
							const { email, password} = ctx.params.user;
							const user = await new UserAction().getUser(email)
							console.log("login user",user)
						console.log("cat",JSON.parse(user).password)
						if (!user) {
							throw new MoleculerClientError(
								"Email or password is invalid!",
								400,
								"",
								[{ field: "email", message: "is not found" }]
							);
						}

						// const res = await Password.compare(
						// 	JSON.parse(user).password,
						// 	password,
						// );
						// if (!res) {
						// 	// let the error be generic 
						// 	throw new MoleculerClientError(
						// 		"invalid password or password",
						// 		422,
						// 		"",
						// 	);
						// }
						// Transform user entity (remove password and all protected fields)

						const doc = await this.transformDocuments(
							ctx,
							{},
							JSON.parse(user)
						);
						return await this.transformEntity(
							doc,
							true,
							ctx.meta.token
						);
						} catch (err) {
							console.log("catch",err)
							throw new MoleculerClientError(
								"invalid credentials",
								400,
								"",
		
							);
						}
					},
				},

			},
		});
	}
}
