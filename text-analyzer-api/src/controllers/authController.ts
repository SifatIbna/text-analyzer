import { Request, Response } from 'express';
import { loginUser, logoutUser, refreshUserToken, validateUserToken } from '../services/authService';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const { accessToken, refreshToken } = await loginUser(username, password);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const logout = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  logoutUser(refreshToken);
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const { accessToken, refreshToken: newRefreshToken } = await refreshUserToken(refreshToken);
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Token refresh failed' });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const userData = await validateUserToken(token);
    res.json(userData);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};