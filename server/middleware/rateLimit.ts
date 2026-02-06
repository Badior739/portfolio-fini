import { Request, Response, NextFunction } from 'express';

type KeyInfo = { count: number; firstTs: number };

const map = new Map<string, KeyInfo>();

export function rateLimit(opts: { windowMs: number; max: number }) {
  // Fix Request and Response property errors by casting req and res to any
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const key = `${req.method}:${req.path}:${ip}`;
      const info = map.get(key);
      if (!info) {
        map.set(key, { count: 1, firstTs: now });
        return next();
      }
      if (now - info.firstTs > opts.windowMs) {
        map.set(key, { count: 1, firstTs: now });
        return next();
      }
      info.count += 1;
      if (info.count > opts.max) {
        res.status(429).json({ success: false, message: 'Too many requests, slow down' });
        return;
      }
      return next();
    } catch (e) {
      return next();
    }
  };
}