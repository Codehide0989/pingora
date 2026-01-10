import postgres from "postgres";

const connectionString = "postgresql://neondb_owner:npg_EWZy0qr7hHSI@ep-crimson-salad-adzrf126-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function test() {
  console.log("Testing connection...");
  const sql = postgres(connectionString, { ssl: "require" });

  try {
    const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log("Tables in public:", result);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await sql.end();
  }
}

test();
