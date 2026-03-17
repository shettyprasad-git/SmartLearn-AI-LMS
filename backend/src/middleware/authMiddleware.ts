import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
     res.status(401).json({ message: 'Authentication required' });
     return;
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
     res.status(403).json({ message: 'Invalid or expired token' });
     return;
  }

  req.user = { userId: decoded.userId };
  next();
};
