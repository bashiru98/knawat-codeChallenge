"use strict";

import { client } from "../../loaders/elastic";
import { checkEmail } from "./emailCheck"
import { registerHelper } from "./register"
import { fetchUser } from "./getUser"

interface UserPayload {
	collection: string;
	userId: string;
	password: string;
	username: string;
	email: string;
	createdAt: Date;
}
export class UserAction {
	public _client: any = client;

	public async createIndex(collection: string) {
		try {
			this._client.indices.create({
				index: collection,
			});
			console.info("index created");
		} catch (error) {
			console.info("error", error);
		}
	}

	public async checkIfEmailExist(email: string): Promise<boolean> {
		return await checkEmail(email,this._client)
	}

	public async createUser(userData: UserPayload) {
		return await registerHelper(userData,this._client)
	}

    public async getUser(email: string) {
        return await fetchUser(email,this._client)
    }
    
}
