import axios from 'axios';
import jwt from 'jsonwebtoken';

const KEYCLOAK_URL = process.env.KEYCLOAK_URL;
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

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