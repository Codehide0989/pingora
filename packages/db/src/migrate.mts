import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { env } from "../env.mjs";

console.log("DB URL:", env.DATABASE_URL);
console.log("DB URL matches:", env.DATABASE_URL === "postgresql://neondb_owner:npg_EWZy0qr7hHSI@ep-crimson-salad-adzrf126-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require");

async function main() {
  const migrationClient = postgres(env.DATABASE_URL, { max: 1, ssl: "require" });
  const db = drizzle(migrationClient);
  console.log("Running migrations");

  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("Migrated successfully");

  process.exit(0);
}

main().catch((e) => {
  console.error("Migration failed");
  console.error(e);
  process.exit(1);
});
