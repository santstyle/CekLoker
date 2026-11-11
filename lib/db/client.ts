import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { schema } from "@/lib/db/schema";
import { requireEnv } from "@/lib/env";

function createDb() {
  return drizzle({ client: neon(requireEnv("DATABASE_URL")), schema });
}

type CekLokerDb = ReturnType<typeof createDb>;

const globalForDb = globalThis as unknown as {
  __ceklokerDb?: CekLokerDb;
};

export function getDb(): CekLokerDb {
  if (!globalForDb.__ceklokerDb) {
    globalForDb.__ceklokerDb = createDb();
  }

  return globalForDb.__ceklokerDb;
}
