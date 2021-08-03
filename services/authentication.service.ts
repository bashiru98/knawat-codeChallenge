"use strict";

import { v4 as uuidv4 } from "uuid";
import { Password } from "../src/utils/password"

import { Service, ServiceBroker } from "moleculer";

import jwt from "jsonwebtoken";

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
				/** Secret for JWT */
				JWT_SECRET: process.env.JWT_SECRET || "knawat-secret",
				issuer: "knawat-secret",
				// Available fields in the responses
				fields: ["_id", "username", "email"],

				// Validator for the `create` & `insert` actions.
				entityValidator: {
					username: { type: "string", min: 2 },
					password: { type: "string", min: 6 },
					email: { type: "email" },
					bio: { type: "string", optional: true },
					image: { type: "string", optional: true },
				},
			},
			methods: {
				/**
				 * Generate a JWT token from user entity
				 *
				 * @param {Object} user
				 */
				generateJWT(user) {
					
					const today = new Date();
					const exp = new Date(today);
					exp.setDate(today.getDate() + 60);

					return jwt.sign(
						{
							username: user.username,
							id:user.userId,
							email: user.email,
							createdAt:user.createdAt,
							exp: Math.floor(exp.getTime() / 1000),
						},
						this.settings.JWT_SECRET
					);
				},

				/**
				 * Transform returned user entity. Generate JWT token if neccessary.
				 *
				 * @param {Object} user
				 * @param {Boolean} withToken
				 */
				transformEntity(user, withToken, token) {
					if (user) {
						if (withToken) {
							user.token = token || this.generateJWT(user);
						}
					}

					return { user };
				},
			},

			actions: {
				/**
				 * Say a 'Hello' action.
				 *
				 */
				register: {
					rest: {
						method: "POST",
						path: "/register",
					},
					params: {
						user: { type: "object" },
					},
					async handler(ctx) {
						const userId = uuidv4();
						const entity = ctx.params.user;
						await this.validateEntity(entity);

						const userExist =
							await new UserAction().checkIfEmailExist(
								entity.email
							);
						if (userExist) {
							throw new MoleculerClientError(
								"Email already exist!",
								400,
								"",
							);
						}

						entity.password = await Password.toHash(entity.password)

						entity.createdAt = new Date();

						const userData = {
							userId,
							email: entity.email,
							password: entity.password,
							username: entity.username,
							collection: "users",
							createdAt: entity.createdAt,
						};
					    new UserAction().createUser(userData);

						const user = await this.transformDocuments(
							ctx,
							{},
							userData,
						);
						const json = await this.transformEntity(
							user,
							true,
							ctx.meta.token
						);
						await this.entityChanged("created", json, ctx);

						return json;
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
						console.log("cat",JSON.parse(user).password)
						if (!user) {
							throw new MoleculerClientError(
								"Email or password is invalid!",
								400,
								"",
								[{ field: "email", message: "is not found" }]
							);
						}

						const res = await Password.compare(
							JSON.parse(user).password,
							password,
						);
						if (!res) {
							// let the error be generic 
							throw new MoleculerClientError(
								"invalid password or password",
								422,
								"",
							);
						}
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
