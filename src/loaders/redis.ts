"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const redis = require('redis');
const util = require('util');

const client = redis.createClient({ host: process.env.REDIS_URL ?? "127.0.0.1" });
client.hget = util.promisify(client.hget);

client.on('connect', async () => {
 
  console.log('Client connected to redis...')
})

client.on('ready', () => {
  console.log('Redis client ready')
})

client.on('error', (err: Error) => {
    console.log(err.message)
    throw new MoleculerClientError("Redis client connection error")
})


process.on('SIGINT', () => {
 client.quit()
})


export { client }