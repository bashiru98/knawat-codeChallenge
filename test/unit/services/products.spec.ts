/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use strict";

import {Errors, ServiceBroker } from "moleculer";
import ProductsService from "../../../services/products.service";
import { error } from "console";

// import { client } from "../../../src/loaders/elastic"


describe("Test 'products actions ", () => {

        describe("check validate params", () => {
            const broker = new ServiceBroker({ logger: false });
            const service = broker.createService(ProductsService);
           
            beforeAll(() => broker.start());
            afterAll(() => broker.stop());
            it("throws an error if name field is not given",  async() => {
                
                try {
                    const res = await broker.call("products.addProductToCart", {
                     userId:"bashiru",
                     product: {  
                        quantity: 10,
                        price: 100,
                        productId: "dadad",
                       
                    }
                    });
                } catch (error) {
                   expect(error).toBeInstanceOf(Errors.ValidationError);
                   expect(error.data[0].field).toEqual("name")
                }
                
            });
            it("throws an error if quantity field is not given",  async() => {
                

                try {
                    const res = await broker.call("products.addProductToCart", {
                     userId:"bashiru",
                     product: {  
                        price: 100,
                        productId: "dadad",
                        name:"323"
                       
                    }
                    });
                } catch (error) {
                    expect(error).toBeInstanceOf(Errors.ValidationError);
                   expect(error.data[0].field).toEqual("quantity")
                }
                
            });
            it("throws an error if price field is not given",  async() => {
                

                try {
                    const res = await broker.call("products.addProductToCart", {
                     userId:"bashiru",
                     product: {  
                        productId: "dadad",
                        name:"323",
                        quantity:20
                       
                    }
                    });
                } catch (error) {
                    expect(error).toBeInstanceOf(Errors.ValidationError);
                   expect(error.data[0].field).toEqual("price")
                }
                
            });
            it("add product to cart",  async() => {
                
                try {
                    const res = await broker.call("products.addProductToCart", {
                     userId:"bashiru",
                     product: {  
                        productId: "dadad",
                        name:"323",
                        quantity:20,
                        price:2000
                       
                    }
                    });
                    // @ts-ignore
                    expect(res).toEqual({ message: 'Item added to cart' })
                } catch (error) {
                    console.info(error)
                }
                
            });
            it("get  cart summary with no items",  async() => {

                try {
                    const res = await broker.call("products.getCartSummary", {
                     userId:"bashiru",
                    });
                    // @ts-ignore
                    expect(res).toEqual({ message: 'no items in your cart' })
                    
                } catch (error) {
                    console.log(error)
                }
                
            });
        })

})

	

