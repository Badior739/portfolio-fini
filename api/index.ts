
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    // Dynamic import to catch initialization errors
    const { createServer } = await import('../server/index');
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
