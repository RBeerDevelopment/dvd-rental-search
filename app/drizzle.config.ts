import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: "file:./src/server/db/local-dev/local.db",
  },
  // driver: "turso",
  // dbCredentials: {
  //   url: env.DATABASE_URL,
  //   authToken: env.DATABASE_TOKEN,
  // },
} satisfies Config;
