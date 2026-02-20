import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Use a strong secret in production!
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-immediately-in-prod';

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow OPTIONS requests
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Entête d\'autorisation manquant' });
    return;
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    res.status(401).json({ error: 'Jeton manquant' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Jeton invalide ou expiré' });
  }
}
