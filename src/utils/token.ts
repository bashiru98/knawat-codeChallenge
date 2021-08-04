"use strict";
import { accessTokenSecret,access_token_expiration,tokenIssuer } from "../config"
import { UserPayload } from "./types"
import jwt from "jsonwebtoken";

export class Token {
    static JWT_SECRET = accessTokenSecret;
    static  options = {
        expiresIn: access_token_expiration,
        issuer: tokenIssuer,
      }
    static async generateToken(user: UserPayload): Promise<string>{
        return  jwt.sign(
            user,
            this.JWT_SECRET,
            this.options
        );
    }
}