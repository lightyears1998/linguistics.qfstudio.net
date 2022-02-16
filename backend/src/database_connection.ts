import { createConnection } from "typeorm";

import {
  PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE
} from "./config";
import { isDevelopmentEnvironment } from "./utils";

export async function initAppDatabaseConnection() {
  return createConnection({
    type: "postgres",
    host: PG_HOST,
    port: PG_PORT,
    username: PG_USERNAME,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    synchronize: true,
    logging: isDevelopmentEnvironment() ? "all" : undefined,
    entities: [`${__dirname}/entity/**/*.{ts,js}`]
  });
}
