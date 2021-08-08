/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use strict";

import {Errors, ServiceBroker } from "moleculer";
import AuthenticationService from "../../../services/authentication.service";


// import { client } from "../../../src/loaders/elastic"


describe("Test 'authentication actions ", () => {

        describe("register and login handlers", () => {
            const broker = new ServiceBroker({ logger: false });
            const service = broker.createService(AuthenticationService);
           
            beforeAll(() => broker.start());
            afterAll(() => broker.stop());
            it("throws an error if password field is not given",  async() => {
                
                try {
                    await broker.call("authentication.register", {
                     user: {  
                        email: "bashiru@gmail.com",
                        username: "bashiru",
                       
                       
                    }
                    });
                } catch (error) {
                   expect(error).toBeInstanceOf(Errors.ValidationError);
                   expect(error.data[0].field).toEqual("password")
                }
                
            });
            it("throws an error if username field is not given",  async() => {
                

                try {
                    await broker.call("authentication.register", {
                        user: {  
                            email: "bashiru@gmail.com",
                            password: "bashiru",
                        
                        }
                    });
                } catch (error) {
                    expect(error).toBeInstanceOf(Errors.ValidationError);
                   expect(error.data[0].field).toEqual("username")
                }
                
            });
            it("throws an error if email field is not given",  async() => {
                

                try {
                     await broker.call("authentication.register", {
                        user: {  
                            password: "bashiru",
                            username:"bashiru"
                        
                        }
                    });
                } catch (error) {
                    expect(error).toBeInstanceOf(Errors.ValidationError);
                   expect(error.data[0].field).toEqual("email")
                }
                
            });
            it("registers a user ",  async() => {
                

                try {
                    const res =  await broker.call("authentication.register", {
                        user: {  
                            password: "bashiru",
                            username:"bashiru",
                            email:"bashiru@gmail.com"
                        
                        }
                    });
                    // @ts-ignore
                    expect(res.user.email).toEqual("bashiru@gmail.com");
                    // @ts-ignore
                    expect(res.token).toBeDefined
                } catch (error) {
                    console.log(error)
                }
                
            });
            it("throws error on login when password is wrong ",  async() => {
                

                try {
                    await broker.call("authentication.login", {
                        user: {  
                            password: "bashiru1",
                            email:"bashiru@gmail.com"
                        
                        }
                    });
                    
                } catch (error) {
                    console.log("res err",error.code)
                    expect(error.code).toBe(400)
                }
                
            });
            it("throws error on login when email is wrong ",  async() => {
                

                try {
                    await broker.call("authentication.login", {
                        user: {  
                            password: "bashiru",
                            email:"bashiru1@gmail.com"
                        
                        }
                    });
                } catch (error) {
                    console.log("res err",error.code)
                    expect(error.code).toBe(400)
                }
                
            });
            it("login when email and password are right",  async() => {
                

                try {
                   const res =  await broker.call("authentication.login", {
                        user: {  
                            password: "bashiru",
                            email:"bashiru@gmail.com"
                        
                        }
                    });
                    // @ts-ignore
                  expect(res.email).toEqual("bashiru@gmail.com");
                    // @ts-ignore
                  expect(res.username).toEqual("bashiru");
                  // @ts-ignore
                  expect(res.password).toEqual(null);
                } catch (error) {
                    console.log(error)
                }
                
            });
            
            
        })

})

	

