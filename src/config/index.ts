const {
    DB_URI,
    PORT,
    ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY,
    REDIS_HOST,
    TOKEN_ISSUER,
    ACCESS_TOKEN_EXPIRATION,
  } = process.env;
  export const port = PORT || 3000;
  export const accessTokenSecret = ACCESS_TOKEN_SECRET_KEY ?? "fafjeofjpowjfkfasfohoa";
  export const refreshTokenSecret = REFRESH_TOKEN_SECRET_KEY ?? "foihof28r2holfhoaifoafho";
  export const MONGO_URI = DB_URI ?? "mongodb://localhost:27017";
  export const redisHost = REDIS_HOST ?? "127.0.0.1";
  export const redisPort = REDIS_HOST ?? 6379;
  export const tokenIssuer = TOKEN_ISSUER ?? "knawat";
  export const access_token_expiration = ACCESS_TOKEN_EXPIRATION ?? "1h";
  export const prefix = "/api";
