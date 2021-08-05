import { client } from "./loaders/elastic";

const startListers = ():void => {
	if (client) {
		client.ping(function (error: Error) {
			if (error) {
				console.error("elasticsearch cluster is down!");
			} else {
				console.info("elasticsearch is connected");
			}
		});
	}
};

export { startListers };
