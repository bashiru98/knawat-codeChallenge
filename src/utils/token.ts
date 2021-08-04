"use strict";
import { accessTokenSecret,access_token_expiration,tokenIssuer } from "../config"
import { UserPayload } from "./types"
import jwt from "jsonwebtoken";

export abstract class Token {
    private  JWT_SECRET = accessTokenSecret;
    private   options = {
        expiresIn: access_token_expiration,
        issuer: tokenIssuer,
      }
     public  async generateToken(user: UserPayload): Promise<string>{
        return  jwt.sign(
            user,
            this.JWT_SECRET,
            this.options
        );
    }
}