import { RequestHandler } from "express";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

const isDbConfigured = () => !!process.env.DATABASE_URL;

export default async function handler(req: any, res: any) {
  const status: any = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    env: {
      node_env: process.env.NODE_ENV,
      db_configured: isDbConfigured(),
      storage_type: process.env.STORAGE_TYPE || 'unknown',
      vercel: !!process.env.VERCEL
    },
    db_connection: 'unknown',
    error: null as string | null
  };

  try {
    if (isDbConfigured() && db) {
      // Simple query to check connection
      await db.execute(sql`SELECT 1`);
      status.db_connection = 'connected';
    } else {
      status.db_connection = 'not_configured';
    }
  } catch (err: any) {
    status.db_connection = 'failed';
    status.error = err.message;
    console.error("Health check failed:", err);
  }

  res.status(status.db_connection === 'failed' ? 500 : 200).json(status);
};

export const handleHealthCheck = handler;
