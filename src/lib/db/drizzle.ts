import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

import { embeddings, resources } from "./schema";

neonConfig.webSocketConstructor = ws;

function getDrizzleClient(datasourceUrl?: string) {
  const connectionString = datasourceUrl || process.env.DATABASE_URL;

  const pool = new Pool({ connectionString });
  return neonDrizzle(pool, { schema: { embeddings, resources } });
}

export const db = getDrizzleClient();
