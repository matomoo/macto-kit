// biome-ignore assist/source/organizeImports: <will fix later>
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema/schema-gefrdb-suldb-v1";

export const client = new Pool({
  host: process.env.DB_GEFRDB_SULDB_V1_HOST,
  port: parseInt(process.env.DB_GEFRDB_SULDB_V1_PORT as string, 10),
  user: process.env.DB_GEFRDB_SULDB_V1_USER,
  password: process.env.DB_GEFRDB_SULDB_V1_PASSWORD,
  database: process.env.DB_GEFRDB_SULDB_V1_NAME,
});

export const db_gefrdb_suldbv1 = drizzle(client, {
  schema: {
    ...schema,
    // vwMondy2G: schema.vwMondy2G,
  },
});
