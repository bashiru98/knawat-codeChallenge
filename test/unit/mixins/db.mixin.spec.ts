/* eslint-disable @typescript-eslint/ban-ts-comment */
"use strict";

import { ServiceBroker } from "moleculer";
import DbService from "moleculer-db";
import DbMixin from "../../../mixins/db.mixin";

describe("Test DB mixin", () => {

	describe("Test schema generator", () => {
		const broker = new ServiceBroker({ logger: false, cacher: "Memory" });

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		it("check schema properties", async () => {
			const schema = new DbMixin("my-collection").start();

			expect(schema.mixins).toEqual([DbService]);
			
    
		});

		it("check cache event handler", async () => {
			jest.spyOn(broker.cacher, "clean");

			const schema = new DbMixin("my-collection").start();

			// @ts-ignore
			await schema.events["cache.clean.my-collection"].call({ broker, fullName: "my-service" });

			expect(broker.cacher.clean).toBeCalledTimes(1);
			expect(broker.cacher.clean).toBeCalledWith("my-service.*");
		});

	});

});