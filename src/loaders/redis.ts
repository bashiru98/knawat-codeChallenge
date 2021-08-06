"use strict";

import  { Errors } from "moleculer";
import redis from "redis";

// to be used just in case broker cacher is not working

const client = redis.createClient({ host: process.env.REDIS_URL || "127.0.0.1" });


client.on("connect", async () => {

  console.log("Client connected to redis...");
});

client.on("ready", () => {
  console.log("Redis client ready");
});

client.on("error", (err: Error) => {
    console.log(err.message);
    throw new Errors.MoleculerClientError("Redis client connection error");
});


process.on("SIGINT", () => {
 client.quit();
});


export { client };
