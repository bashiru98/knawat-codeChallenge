"use strict";

const { MoleculerClientError } = require("moleculer").Errors;

import { Token } from "../utils/token"
import { UserPayload } from "../utils/types"
import { UserAction } from "../services/users/index"
import { Password } from "../utils/password"

export class Register{
    static entity: any;
    static params : {
        user: { type: "object" },
    }
    static rest : {
        method: "POST",
        path: "/register",
    }
    constructor(public entity: any,
        public userData: any) {

        this.entity = entity
        this.userData = userData
    }
    public  async $handler(ctx:any,user:any):Promise<any> {
        const userExist =
        await new UserAction().checkIfEmailExist(
            this.entity.email
        );
    if (userExist) {
        throw new MoleculerClientError(
            "Email already exist!",
            400,
            "",
        );
        }
        
        user.password = await Password.toHash(this.entity.password)
        console.log("user password",await Password.toHash(this.entity.password))
        new UserAction().createUser(user);
    
            const json = await this.transformEntity(
                { ...user },
                true,
                ctx.meta.token      
        );
        json.user.password = null
        console.log("json logger",json)
        return json
    }
    
    public getToken(user: UserPayload) {
        return Token.generateToken(user)
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

function take(callback:any) :void{
    
}