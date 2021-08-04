"use strict";

const fetchUser = async (email: string, _client: any): Promise<string> => {
	try {
		const res = await _client.search({
			index: "users",
			_source: ["email", "userId", "username", "createdAt", "password"],
			type: "user_data",
			body: {
				query: {
					terms: {
						_id: [email],
					},
				},
			},
		});
		return JSON.stringify(res.body?.hits.hits[0]._source);
	} catch (error) {
		console.info(error.message);
	}
};

export { fetchUser };
