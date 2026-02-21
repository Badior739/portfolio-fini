import { RequestHandler } from "express";
import { db, isDbConfigured } from "../server/db/index";
import { sql } from "drizzle-orm";

export const handleHealthCheck: RequestHandler = async (req, res) => {
  const status = {
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
