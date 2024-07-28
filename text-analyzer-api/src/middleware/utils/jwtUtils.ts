import jwt, { JwtPayload, Algorithm } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface CustomJWTPayload extends JwtPayload {
  user_id: string;
}

export class JWTDecoder {
  private static JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  private static ALGORITHM: Algorithm = 'HS256';

  static decodeJWT(token: string): CustomJWTPayload {
    if (!this.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not set in environment variables');
    }

    try {
      const decoded = jwt.verify(token, this.JWT_SECRET_KEY, { algorithms: [this.ALGORITHM] });
      
      // Type guard to ensure decoded is of type CustomJWTPayload
      if (typeof decoded === 'object' && decoded !== null && 'user_id' in decoded) {
        return decoded as CustomJWTPayload;
      } else {
        throw new Error('Invalid token structure');
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log(`Token expired`);
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.log(`Invalid token`);
      } else {
        console.log(`Token validation error`);
      }
      throw error;
    }
  }
}