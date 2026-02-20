
import { db } from "../server/db";
import { migrate } from "drizzle-orm/node-postgres/migrator";

async function runMigrate() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  console.log("⏳ Running migrations...");

  try {
    // This will automatically run needed migrations on the database
    await migrate(db!, { migrationsFolder: "drizzle" });
    console.log("✅ Migrations completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigrate();
