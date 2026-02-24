
import type { Request, Response } from 'express';
import { createServer } from '../server/index';

let cachedApp: any;

export default async function handler(req: Request, res: Response) {
  try {
    if (!cachedApp) {
      cachedApp = createServer();
    }
    return cachedApp(req, res);
  } catch (e: any) {
    console.error('Server Startup Error:', e);
    res.status(500).json({
      error: 'Server Startup Failed',
      message: e.message,
      stack: e.stack,
      env: {
        node_env: process.env.NODE_ENV,
        has_db_url: !!process.env.DATABASE_URL
      }
    });
  }
}
