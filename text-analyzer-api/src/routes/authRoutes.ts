import express from 'express';
import { login, logout, refreshToken, validateToken } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/validate', validateToken);

export default router;