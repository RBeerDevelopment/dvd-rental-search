import { env } from "~/env";
import * as schema from "./schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// /**
//  * Cache the database connection in development. This avoids creating a new connection on every HMR
//  * update.
//  */
// const globalForDb = globalThis as unknown as {
//   conn: Database.Database | undefined;
// };

// export const conn =
//   globalForDb.conn ?? new Database(env.DATABASE_URL, { fileMustExist: false });
// if (env.NODE_ENV !== "production") globalForDb.conn = conn;

const tursoClient = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_TOKEN,
});

export const tursoDb = drizzle(tursoClient, { schema });

const client = createClient({
  url: "file:/Users/robinbeer/projects/videothek/app/src/server/db/local-dev/local.db",
});

export const db = drizzle(client, { schema });
