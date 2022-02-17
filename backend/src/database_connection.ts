import path from "path";

import { createConnection } from "typeorm";

import {
  PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE, APP_VAR_DIR
} from "./config";
import { isDevelopmentEnvironment } from "./utils/node";

export async function initAppDatabaseConnection() {
  return createConnection({
    type: "better-sqlite3",
    database: path.resolve(APP_VAR_DIR, "./database.sqlite3"),
    synchronize: true,
    logging: isDevelopmentEnvironment() ? "all" : undefined,
    entities: [`${__dirname}/entity/**/*.{ts,js}`]
  });
}
