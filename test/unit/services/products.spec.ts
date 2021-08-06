/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use strict";

import {ServiceBroker } from "moleculer";
import ProductsService from "../../../services/products.service";
import ApiService  from "../../../services/api.service";
// import { client } from "../../../src/loaders/elastic"
import  request  from "supertest"

describe("Test 'products api ", () => {

	describe("Test addd to cart api", () => {
		const  broker = new ServiceBroker({ logger: false });
        broker.createService(ProductsService);
        const apiService = broker.createService( ApiService);

    beforeAll(() => broker.start());
    afterAll(() => broker.stop());
		

    it("return an error when name of product is missing ", () => {
        return request(apiService.server())
            .get("/api/products/cart/summary/bashiru")
            .then(res => {
                console.log(res.body)
                expect(res.statusCode).toBe(404);
            });
    });
		

	});

	

});