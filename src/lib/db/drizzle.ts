import {
  drizzle as neonDrizzle,
} from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;

function getDrizzleClient(datasourceUrl?: string) {
  const connectionString = datasourceUrl || process.env.DATABASE_URL;

  const pool = new Pool({ connectionString });
  return neonDrizzle(pool, { schema });
}

export const db = getDrizzleClient();
