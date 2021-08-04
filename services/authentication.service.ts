"use strict";
import { Mixin } from 'ts-mixer';
import { Register } from "../src/api/register";
import { Login } from "../src/api/login";
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
							
						const user = await new Login().$handler(ctx)
						// Transform user entity (remove password and all protected fields)
                        console.log("user",user)
						const doc = await this.transformDocuments(
							ctx,
							{},
							JSON.parse(user)
						);
						doc.password = null
						return await new Login().transformEntity(
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
