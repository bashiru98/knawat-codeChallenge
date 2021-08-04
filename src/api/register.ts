"use strict";
import { Service,ServiceBroker } from "moleculer";
const { MoleculerClientError } = require("moleculer").Errors;
import { v4 as uuidv4 } from "uuid";
import { Token } from "../utils/token"
import { UserPayload } from "../utils/types"
import { UserAction } from "../services/users/index"
import { Password } from "../utils/password"

export class Register extends Service{
    static userId: string = uuidv4()
    static entity: any;
    static param = {
        user: { type: "object" },
    }
    static rest : {
        method: "POST",
        path: "/register",
    }
    userData:any
    constructor(
        public entity: any,
        public broker: ServiceBroker
        ) {
        super(broker)
        this.entity = entity
        this.userData = {
            userId:uuidv4(),
            email: entity.email,
            password: entity.password,
            username: entity.username,
            collection: "users",
            createdAt: new Date(),
        };
    }
    public async $handler(ctx:any):Promise<any> {
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

    this.entity.password = await Password.toHash(this.entity.password)

        new UserAction().createUser(this.userData);
        const user = await this.transformDocuments(
            ctx,
            {},
            this.userData,
        );
        const json = await this.formatEntity(
            user,
            true,
            ctx.meta.token
        );
        await this.entityChanged("created", json, ctx);
        return json;
    }
    
     protected async formatEntity(user:any,withToken:any,token:string) {
        if (user) {
            if (withToken) {
                user.token = token || this.getToken(user);
            }
        }
        return { user };
    }
   public static getToken(user:UserPayload) {
        return Token.generateToken(user)
    }
   
}

