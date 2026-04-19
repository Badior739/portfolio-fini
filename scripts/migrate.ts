import { db } from "../server/db";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

async function runMigrate() {
  console.log("⏳ Running migrations...");

  try {
    // This will automatically run needed migrations on the database
    await migrate(db as any, { migrationsFolder: "drizzle" });
    console.log("✅ Migrations completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigrate();
