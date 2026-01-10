import fs from "fs";
import path from "path";
import postgres from "postgres";
import { env } from "../env.mjs";

async function main() {
  console.log("Starting manual migration...");
  const connStr = "postgresql://neondb_owner:npg_EWZy0qr7hHSI@ep-crimson-salad-adzrf126-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
  console.log("Using hardcoded DB URL");
  
  const sql = postgres(connStr, { ssl: "require", max: 1 });
  
  try {
    // manually create schema if not exists
    await sql`CREATE SCHEMA IF NOT EXISTS "drizzle"`;
    console.log("Schema 'drizzle' ensured.");

    const drizzleDir = path.join(process.cwd(), "drizzle");
    const files = fs.readdirSync(drizzleDir).filter(f => f.endsWith(".sql")).sort();

    for (const file of files) {
      console.log(`Migrating: ${file}`);
      const content = fs.readFileSync(path.join(drizzleDir, file), "utf-8");
      
      // Basic split by statement might be needed if postgres.js doesn't handle multi-statement scripts well
      // But typically it does for simple migrations. If not, we might fail.
      // Drizzle generates standard SQL, usually ; separated.
      // postgres.js `file` helper is good, but here we have string.
      // sql(content) might treat it as a prepared statement which fails for multiple statements.
      // Use sql.unsafe? No, postgres.js has `sql.file` or similar.
      // Or verify if sql`...` works for multiple statements. It usually treats it as a single query unless simple.
      // Best approach for script execution is sql.unsafe(content) but postgres.js doesn't have unsafe like that easily?
      // Actually postgres.js `sql` template tag is strict.
      // We can use `simple()` method if available?
      // Or just try.
      
      const statements = content.split("--> statement-breakpoint");
      for (const statement of statements) {
        if (statement.trim().length > 0) {
          await sql.unsafe(statement);
        }
      }
    }
    console.log("All migrations executed successfully.");
  } catch (e) {
    console.error("Migration failed:", e);
  } finally {
    await sql.end();
  }
}

main();
