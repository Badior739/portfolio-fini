import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Export a function to get DB or check if configured
export const isDbConfigured = () => !!process.env.DATABASE_URL;

let _db: NodePgDatabase<typeof schema> | null = null;

if (process.env.DATABASE_URL) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });
  _db = drizzle(pool, { schema });
}

export const db = _db;
