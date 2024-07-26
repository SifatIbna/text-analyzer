import { Request, Response, NextFunction } from 'express';
import { validateUserToken } from '../services/authService';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const user = await validateUserToken(token);
    (req as any).user = user;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};