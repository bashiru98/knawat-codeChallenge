"use strict";
import { Mixin } from 'ts-mixer';
const { MoleculerClientError } = require("moleculer").Errors;

import { Token } from "../utils/token"
import { UserPayload } from "../utils/types"
import { UserAction } from "../services/users/index"
import { Password } from "../utils/password"

export class Login extends Mixin(Password,Token,UserAction) {
    static entity: any;
    static params: {
        user: {
            type: "object",
            props: {
                email: { type: "email" },
                password: { type: "string" },
            },
        },
    }
    static rest : {
        method: "POST",
        path: "/login",
    }
    constructor() {
        super()
    }
    public async $handler(ctx:any):Promise<any> {
     const user = await super.getUser(ctx.params.user.email)
        console.log("user data",user)
    if (!user) {
        throw new MoleculerClientError(
            "Email or password is invalid!",
            400,
            "",
            [{ field: "email", message: "is not found" }]
        );
    }

    const res = await super.compare(
        JSON.parse(user).password,
        ctx.params.user.password,
    );
    if (!res) {
        // let the error be generic 
        throw new MoleculerClientError(
            "invalid password or password",
            422,
            "",
        );
        }
        
        return user
    }
    
     public  getToken(user: UserPayload) {
        return super.generateToken(user)
    }
     public async transformEntity(user:any, withToken:boolean, token:string) {
        if (user) {
            if (withToken) {
                user.token = token || await this.getToken(user);
            }
        }
        
        return { user };
    }
}
