
import type { Request, Response } from 'express';
// Use relative path to source file, Vercel build will handle it
import { createServer } from '../server/index';

export default async function handler(req: Request, res: Response) {
  try {
    const app = createServer();
    
    // Forward the request to the Express app
    return app(req, res);
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
