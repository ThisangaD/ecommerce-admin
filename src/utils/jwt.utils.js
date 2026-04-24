import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'fallback-secret';
const EXPIRY = process.env.JWT_EXPIRY || '24h';

export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRY });
export const verifyToken = (token) => jwt.verify(token, SECRET);
