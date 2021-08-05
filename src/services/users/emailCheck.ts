/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use strict";

const checkEmail = async (email: string, _client: any):Promise<boolean> => {
	const res = await _client.search({
		index: "users",
		_source: ["email", "userId", "username", "createdAt"],
		type: "user_data",
		body: {
			query: {
				terms: {
					_id: [email],
				},
			},
		},
	});

	return !!JSON.stringify(res.body?.hits.hits[0]?._id);
};

export { checkEmail };
