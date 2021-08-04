"use strict";

// @ts-expect-error
import MongoAdapter from "moleculer-db-adapter-mongo";
import { Context, Service, ServiceSchema } from "moleculer";
import DbService from "moleculer-db";

export default class Connection
	implements Partial<ServiceSchema>, ThisType<Service>
{
	private cacheCleanEventName: string;
	private collection: string;
	private schema: Partial<ServiceSchema> & ThisType<Service>;

	public constructor(public collectionName: string) {
		this.collection = collectionName;
		this.cacheCleanEventName = `cache.clean.${this.collection}`;
		this.schema = {
			mixins: [DbService],
			events: {
				/**
				 * Subscribe to the cache clean event. If it's triggered
				 * Clean the cache entries for this service.
				 *
				 */
				async [this.cacheCleanEventName]() {
					if (this.broker.cacher) {
						await this.broker.cacher.clean(`${this.fullName}.*`);
					}
				},
			},
			methods: {
				entityChanged: async (
					type: string,
					json: any,
					ctx: Context
				) => {
					await ctx.broadcast(this.cacheCleanEventName);
				},
			},
		};
	}

	public start() {

		this.schema.adapter = new MongoAdapter(
			process.env.MONGO_URI ?? "mongodb://localhost:27017/moleculer"
		);
		this.schema.collection = this.collection;
		return this.schema;
	}

	public get _collection(): string {
		return this.collection;
	}

	public set _collection(value: string) {
		this.collection = value;
	}
}
