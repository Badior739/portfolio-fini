
import type { Request, Response } from 'express';
// Import depuis le dossier de build généré par tsc
import { createServer } from '../dist/server/server/index'; 

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
      message: e.message
    });
  }
}
