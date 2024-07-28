import axios from 'axios';

import jwt, { JwtPayload, Algorithm } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const KEYCLOAK_URL = process.env.KEYCLOAK_URL;
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const ALGORITHM: Algorithm = 'HS256';

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(`${KEYCLOAK_URL}/protocol/openid-connect/token`, new URLSearchParams({
    grant_type: 'password',
    client_id: CLIENT_ID!,
    client_secret: CLIENT_SECRET!,
    username,
    password
  }));

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token
  };
};

export const logoutUser = async (refreshToken: string) => {
  await axios.post(`${KEYCLOAK_URL}/protocol/openid-connect/logout`, new URLSearchParams({
    client_id: CLIENT_ID!,
    client_secret: CLIENT_SECRET!,
    refresh_token: refreshToken
  }));
};

export const refreshUserToken = async (refreshToken: string) => {
  const response = await axios.post(`${KEYCLOAK_URL}/protocol/openid-connect/token`, new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID!,
    client_secret: CLIENT_SECRET!,
    refresh_token: refreshToken
  }));

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token
  };
};

export const validateUserToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export interface CustomJWTPayload extends JwtPayload {
  sub: string;
}

export class JWTDecoder {

  static decodeJWT(token: string): CustomJWTPayload {
    if (!JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not set in environment variables');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY, { algorithms: [ALGORITHM] });
      console.log(decoded)
      // Type guard to ensure decoded is of type CustomJWTPayload
      if (typeof decoded === 'object' && decoded !== null && 'sub' in decoded) {
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