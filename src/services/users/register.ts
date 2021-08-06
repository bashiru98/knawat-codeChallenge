/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use strict";

interface UserPayload {
	collection: string;
	userId: string;
	password: string;
	username: string;
	email: string;
	createdAt: Date;
}

const registerHelper = async (
	userData: UserPayload,
	_client: any
): Promise<string> => {
	try {
		const res = await _client.index({
			index: userData.collection,
			id: userData.email,
			type: "user_data",
			body: {
				userId: userData.userId,
				email: userData.email,
				password: userData.password,
				username: userData.username,
				createdAt: userData.createdAt,
			},
		});
		return JSON.stringify(res.body?._id);
	} catch (err) {
		console.info(err);
	}
};

export { registerHelper };
