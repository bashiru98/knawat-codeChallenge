"use strict";

export interface UserPayload {
	username: string;
	id: string;
	email: string;
	createdAt: string;
	exp: Date;
	token?:string;
}


