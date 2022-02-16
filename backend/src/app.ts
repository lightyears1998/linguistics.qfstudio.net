import path from "path";

import Koa from "koa";
import mount from "koa-mount";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { GraphQLSchema, printSchema } from "graphql";
import { useContainer, createConnection } from "typeorm";
import fs from "fs-extra";
import { Container } from "typedi";
import responseTimeMiddleware from "koa-response-time";
import compressMiddleware from "koa-compress";
import corsMiddleware from "@koa/cors";
import sessionMiddleware from "koa-session";
import staticMiddleware from "koa-static";
import { koa as voyagerMiddleware } from "graphql-voyager/middleware";
import redisStore from "koa-redis";
import {
  fieldExtensionsEstimator, getComplexity, simpleEstimator
} from "graphql-query-complexity";
import Router from "koa-router";
import { CronJob } from "cron";

import {
  APP_VAR_DIR, APP_HOST, APP_PORT, APP_SECRET, QUERY_COMPLEXITY_LIMIT, APP_SESSION_KEY,
  APP_PROXY, PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE
} from "./config";
import {
  genSecret, isDevelopmentEnvironment, redis
} from "./utils";
import { authChecker } from "./auth/AuthChecker";
import { appUserContextMiddleware } from "./auth/AppUserContextMiddleware";
import { setupUserContext } from "./context";

let GRAPHQL_SCHEMA_SDL = "";

async function setupEnvironment() {
  await fs.ensureDir(APP_VAR_DIR);
  console.log("💾 Application variable path: " + APP_VAR_DIR);
}

async function setupDatabase(): Promise<void> {
  useContainer(Container);

  await createConnection({
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

async function setupGraphQLSchema(): Promise<GraphQLSchema> {
  const schema = await buildSchema({
    resolvers: [`${__dirname}/resolver/**/*.{ts,js}`],
    container: Container,
    authChecker: authChecker
  });
  Container.set("graphql-schema", schema);

  GRAPHQL_SCHEMA_SDL = printSchema(schema);
  console.log("📁 Graphql Schema is ready.");

  return schema;
}

async function setupApolloServer(schema: GraphQLSchema) {
  const server = new ApolloServer({
    schema,
    playground: true,
    tracing: isDevelopmentEnvironment(),
    context: ({ ctx }) => ctx,
    plugins: [
      {
        /*
         * GraphQL 查询复杂度插件
         * 参阅：https://github.com/MichalLytek/type-graphql/blob/1d00afe6da943d57bf64d46814c67c89f2e1af82/docs/complexity.md
         */
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            const complexity = getComplexity({
              schema,
              operationName: request.operationName,
              query: document,
              variables: request.variables,
              estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })]
            });

            if (complexity > QUERY_COMPLEXITY_LIMIT) {
              throw new Error(`本次请求具有复杂度 ${complexity}，因超过复杂度上限限制 ${QUERY_COMPLEXITY_LIMIT} 而未被执行。`);
            }
          }
        })
      }
    ]
  });

  return server;
}

async function setupKoa(server: ApolloServer): Promise<Koa> {
  const app = new Koa();

  app.proxy = APP_PROXY;
  app.keys = [APP_SECRET ? APP_SECRET : genSecret()];

  app.use(responseTimeMiddleware({ hrtime: true }));
  app.use(corsMiddleware({ credentials: true }));
  app.use(sessionMiddleware({
    maxAge: 1000 * 60 * 60 * 24 * 7,
    key: APP_SESSION_KEY,
    store: redisStore({ client: redis }),
    renew: true
  }, app));
  app.use(appUserContextMiddleware);
  app.use(compressMiddleware());
  app.use(staticMiddleware(path.join(__dirname, "../public")));
  app.use(server.getMiddleware());

  const router = setupRouter();
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(mount("/download", staticMiddleware(path.join(APP_VAR_DIR, "./download"))));

  setupUserContext(app);

  return app;
}

function setupRouter(): Router {
  const router = new Router();

  router.get("/graphql/schema.sdl", async (ctx, next) => {
    ctx.body = GRAPHQL_SCHEMA_SDL;
    return next();
  });

  router.all(
    "/graphql/voyager",
    voyagerMiddleware({ endpointUrl: "/graphql" }),
  );

  return router;
}

async function performMaintenance(): Promise<void> {
  console.log("⚙ Maintenance is running in the background.");
  console.log("🛠 Maintenance is complete. ");
}

async function bootstrap() {
  await setupEnvironment();
  await setupDatabase();
  const schema = await setupGraphQLSchema();
  const server = await setupApolloServer(schema);
  const app = await setupKoa(server);

  const maintenanceJob = new CronJob("0 */10 * * * *", () => {
    performMaintenance();
  });
  maintenanceJob.start();

  await new Promise<void>((resolve) => {
    app.listen({ host: APP_HOST, port: APP_PORT }, resolve);
  });

  console.log(`🚀 Server ready at http://${APP_HOST}:${APP_PORT}${server.graphqlPath}`);
}

bootstrap();
