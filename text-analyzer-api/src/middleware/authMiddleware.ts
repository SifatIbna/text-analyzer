import { Request, Response, NextFunction } from 'express';
import { validateUserToken,JWTDecoder,CustomJWTPayload } from '../services/authService';

// Extend the Request type to include the user property
export interface AuthenticatedRequest extends Request {
  user?: CustomJWTPayload;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // Check for token in Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      token = parts[1];
    }
  }

  // If not in header, check for token in cookie
  if (!token && req.cookies) {
    token = req.cookies.access_token;
    console.log(token)
  }

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = await JWTDecoder.decodeJWT(token);
    req.user = user;
    next();
  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};