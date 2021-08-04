"use strict";
import { v4 as uuidv4 } from "uuid";

const userSchema = (entity: any) => ({
	userId: uuidv4(),
	email: entity.email,
	password: entity.password,
	username: entity.username,
	collection: "users",
	createdAt: new Date(),
});

export { userSchema };
