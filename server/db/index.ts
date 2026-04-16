import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

export const isDbConfigured = () => !!process.env.DATABASE_URL;

let _db: NodePgDatabase<typeof schema> | null = null;

if (process.env.DATABASE_URL) {
  try {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });
    _db = drizzle(pool, { schema });
  } catch (e) {
    console.error("Failed to connect to database, falling back to JSON storage:", e);
  }
}

export const db = _db;
